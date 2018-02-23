import 'source-map-support/register';
import 'core-js';
import 'reflect-metadata';

import { EventEmitter } from 'events';
import { getConnectionManager } from 'typeorm';
import uuid = require( 'uuid' );
import { GameEntity, GameStateEntity, LoginEntity, RoomEntity, SessionEntity, UserEntity } from './entities/index';
import express = require( 'express' );
import { Socket } from './socket';
import { SocketManager } from './socket-manager';
import index = require( 'serve-index' );
import { EntityManager } from 'typeorm/entity-manager/entitymanager';
import { Rules } from './rules';

const { NODE_PORT = 3000,
		NODE_IP = 'localhost',
		OPENSHIFT_REDIS_HOST,
		OPENSHIFT_REDIS_PASSWORD,
		OPENSHIFT_REDIS_PORT
	} = process.env,
	app = express(),
	compression = require( 'compression' ),
	// server = require( 'http' ).Server( app ),
	// io = require( 'socket.io' )( server ) as SocketIO.Server,
	rules = new Rules;

require( 'express-ws' )( app );

/*
if( OPENSHIFT_REDIS_HOST ) {
	const redis = require( 'redis' ).createClient,
		adapter = require( 'socket.io-redis' ),
		pub = redis( OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, { auth_pass: OPENSHIFT_REDIS_PASSWORD } ),
		sub = redis( OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, { return_buffers: true, auth_pass: OPENSHIFT_REDIS_PASSWORD } );

	io.adapter( adapter( { pubClient: pub, subClient: sub } ) );
}
*/

app.use( require( 'body-parser' ).json() );

app.get( '/health', ( req, res ) => {
	res.writeHead( 200 );
	res.end();
} );

function debug( this: any, fn: Function, name = fn.name ) {
	return function( ...args ) {
		console.log( name, ...args );
		const retval = fn.apply( this, args );
		console.log( name, retval );
		return retval;
	};
}

function debugAsync( this: any, fn: Function, name = fn.name ) {
	return async function( ...args ) {
		console.log( name, ...args );
		const retval = await fn.apply( this, args );
		console.log( name, retval );
		return retval;
	};
}

const connectionManager = getConnectionManager();
( async () => {
	try {
		const connection =
			await connectionManager.create( {
				name: 'sqlite',
				driver: {
					type: 'sqlite',
					storage: ':memory:'
				},
				entities: [ `${__dirname}/entities` ],
				namingStrategies: [ require( './naming-strategies' ).R3NamingStrategy ],
				usedNamingStrategy: 'R3NamingStrategy',
				logging: {
					logSchemaCreation: false,
					logQueries: true
				}
			} );
		await connection.connect();
		await connection.syncSchema();
		const { entityManager } = connection,
			userId = uuid.v4();

		async function transaction( em: EntityManager, cb: ( em: EntityManager ) => Promise<any>|void ) {
			if( em === entityManager ) {
				await em.transaction( async transaction => {
					await cb( transaction );
				} );
			} else {
				await cb( em );
			}
		}

		await transaction( entityManager, transaction => Promise.all( [
			transaction.persist(
				new UserEntity( {
					userId,
					nick: 'error'
				} )
			),
			transaction.persist( new LoginEntity( {
				userId,
				username: 'error',
				passwordHash: ''
			} ) )
		] ) );

		const socketManager = new SocketManager;

		function isValidNick( nick: string ) {
			if( !nick ) {
				return false;
			}
			return /^[_a-z][-_a-z0-9]{1,34}[_a-z0-9]+/i.test( nick );
		}

		async function usersInRoom( roomId: string, em: EntityManager ) {
			const [ , count ] =
				await em.findAndCount( SessionEntity, session => session.rooms.some( room => room.roomId === roomId ) );
			return count;
		}

		async function flushRooms( sessionIds: string[], em: EntityManager ) {
			const roomEntities = await em.find( RoomEntity );
			await socketManager.send( {
				name: 'rooms',
				data: roomEntities.map( room => ( {
					roomId: room.roomId,
					name: room.name
				} ) )
			}, sessionIds );
		}

		async function cleanupRooms( em: EntityManager ) {
			let removed = 0;
			await transaction( em, async transaction => {
				const promises = [] as Promise<any>[];
				for( const room of await transaction.find( RoomEntity ) ) {
					if( ( room.sessions || [] ).length <= 0 ) {
						const { roomId } = room;
						console.log( `Deleting room ${roomId}...` );
						promises.push( transaction.remove( room ) );
						++removed;
					}
				}
				await Promise.all( promises );
				if( removed ) {
					flushRooms( [], transaction );
				}
			} );
		}

		async function flushUpdate( room: Room, sessionIds: string[], em: EntityManager ) {
			const data = await getGame( room.gameId, em );
			socketManager.send( { name: 'update', data }, sessionIds );
		}

		async function getGame( gameId: string, em: EntityManager ) {
			const gameRecord = await em.findOneById( GameEntity, gameId );
			if( !gameRecord ) {
				throw new Error( `Game ${gameId} not found.` );
			}
			const game: Game = {
				gameId,
				gameStates: gameRecord.gameStates.map( g => ( {
					board: new Board,
					turn: 0
				} ) )
			};
			return game;
		}

		function statusMessage( roomId: string, message: string, sessionIds?: string[] ) {
			socketManager.send( { name: 'message', data: { roomId, message } }, sessionIds );
			return true;
		}

		function chatMessage( roomId: string, user: string, message: string, sessionIds?: string[] ) {
			socketManager.send( { name: 'message', data: { roomId, user, message } }, sessionIds );
			return true;
		}

		async function newGame( roomEntity: RoomEntity, em: EntityManager ) {
			statusMessage( roomEntity.roomId, 'New game' );
			const gameId = uuid.v4(),
				gameEntity = new GameEntity( { gameId } ),
				game = rules.newGame( gameId );
			Object.assign( roomEntity, { gameId } );
			await transaction( em, async transaction => {
				await Promise.all( [
					transaction.persist( gameEntity ),
					transaction.persist( roomEntity )
				] );
				await flushRooms( [], transaction );
				await flushUpdate( roomEntity, [], transaction );
			} );
			return game;
		}

		async function createRoom( name: string, em: EntityManager ) {
			const roomId = uuid.v4(),
				roomEntity =
					new RoomEntity( {
						roomId,
						name
					} );
			await newGame( roomEntity, em );
			return roomEntity;
		}

		async function makeMove( room: RoomEntity, position: Point, em: EntityManager ) {
			const game = await getGame( room.gameId, em );
			if( !rules.makeMove( game, position ) ) {
				return false;
			}
			const { roomId } = room,
				{ gameStates } = game,
				gameState = gameStates[ gameStates.length - 1 ],
				{ board } = gameState;
			if( rules.isGameOver( board ) ) {
				const black = rules.getScore( board, 0 ),
					white = rules.getScore( board, 1 );
				if( black > white ) {
					await statusMessage( roomId, `Black wins ${black}:${white}` );
				} else if( white > black ) {
					await statusMessage( roomId, `White wins ${white}:${black}` );
				} else {
					await statusMessage( roomId, 'Draw game' );
				}
			}
			await flushUpdate( room, [], em );
			return true;
		}

		app.param( 'sessionId', ( req, res, next, sessionId ) => {
			req[ 'sessionId' ] = sessionId || uuid();
			next();
		} );

		async function getRoom( roomId: string, em: EntityManager ) {
			const room = await em.findOneById( RoomEntity, roomId );
			if( !room ) {
				throw new Error( `Room ${roomId} not found.` );
			}
			return room;
		}

		async function getSession( sessionId: string, em: EntityManager ) {
			const session = await em.findOneById( SessionEntity, sessionId );
			if( !session ) {
				throw new Error( `Session ${sessionId} not found.` );
			}
			return session;
		}

		async function getUser( sessionId: string, em: EntityManager ) {
			const { user } = await getSession( sessionId, em );
			return user;
		}

		async function getNick( sessionId: string, em: EntityManager ) {
			const user = await getUser( sessionId, em );
			if( user ) {
				return user.nick;
			} else {
				return 'Guest';
			}
		}

		async function flushJoinedRooms( sessionId: string, em: EntityManager ) {
			const session = await getSession( sessionId, em );
			socketManager.send( { name: 'joinedRooms', data: ( session.rooms || [] ).map( room => room.roomId ) }, [ sessionId ] );
		}

		async function leaveRoom( sessionId: string, roomId: string, em: EntityManager ) {
			const session = await getSession( sessionId, em );
			session.rooms = session.rooms!.filter( room => room.roomId !== roomId );
			await em.persist( session );
			const nick = await getNick( sessionId, em );
			await flushJoinedRooms( sessionId, em );
			await statusMessage( roomId, `${nick} has left the room.` );
		}

		async function joinRoom( sessionId: string, roomId: string, em: EntityManager ) {
			await transaction( em, async transaction => {
				const [ session, room ] = await Promise.all( [ getSession( sessionId, transaction ), getRoom( roomId, transaction ) ] );
				session.rooms.push( room );
				await transaction.persist( session );
				const nick = await getNick( sessionId, transaction );
				await flushJoinedRooms( sessionId, transaction );
				await statusMessage( roomId, `${nick} has joined the room.` );
			} );
		}

		const commands = {
			async help( sessionId: string, roomId: string ) {
				await statusMessage( roomId, `Available commands:
/?
/help
/nick <username>
/quit
`, [ sessionId ] );
			},
			async '?'( sessionId: string, roomId: string ) {
				await commands.help( sessionId, roomId );
			},
			async nick( sessionId: string, roomId: string, nick: string ) {
				await transaction( entityManager, async transaction => {
					if( !isValidNick( nick ) ) {
						throw new Error( 'Invalid nick.' );
					}
					const user = await getUser( sessionId, transaction );
					if( !user ) {
						throw new Error( 'You must be logged in.' );
					}
					const previousNick = user.nick;
					user.nick = nick;
					await transaction.persist( UserEntity, user );
					await statusMessage( roomId, `${previousNick} is now known as ${nick}.`, [] );
				} );
			},
			async quit( sessionId: string, roomId: string ) {
				await transaction( entityManager, async transaction => {
					await leaveRoom( sessionId, roomId, transaction );
				} );
			}
		};
		const command = debugAsync(
			async function command( sessionId: string, roomId: string, raw: string ) {
				const [ cmd, ...params ] = raw.trim().split( /\s+/g );
				try {
					if( !commands.hasOwnProperty( cmd ) ) {
						throw new Error( 'Unknown command.' );
					}
					await commands[ cmd ]( sessionId, roomId, ...params );
				} catch( ex ) {
					if( ex && ex.message ) {
						await statusMessage( roomId, ex.message, [ sessionId ] );
					}
					throw ex;
				}
			}
		);

		app.ws( '/ws/:sessionId', async ( ws, req ) => {
			const sessionId = req[ 'sessionId' ] as string;
			await transaction( entityManager, async transaction => {
				let session = await transaction.findOneById( SessionEntity, sessionId );
				if( !session ) {
					session =
						await transaction.persist(
							new SessionEntity( { sessionId } )
						);
				}
			} );
			socketManager.addConnection( ws, sessionId );
		} );

		socketManager.getMessages<{ roomId: string, position: Point }>( 'makeMove' )
		.subscribe( async ( [ { data: { roomId, position } }, responder, { sessionId } ] ) => {
			try {
				await transaction( entityManager, async transaction => {
					const room = await getRoom( roomId, transaction );
					if( !await makeMove( room, position, transaction ) ) {
						throw new Error( 'Failed to make move.' );
					}
					responder.resolve( {} );
				} );
			} catch( ex ) {
				console.error( ex );
				responder.reject( ex );
			}
		} );

		socketManager.getMessages<{ roomId: string }>( 'newGame' )
		.subscribe( async ( [ { data: { roomId } }, responder, { sessionId } ] ) => {
			try {
				await transaction( entityManager, async transaction => {
					const game = await newGame( await getRoom( roomId, transaction ), transaction );
					responder.resolve( { game } );
				} );
			} catch( ex ) {
				console.error( ex );
				responder.reject( ex );
			}
		} );

		socketManager.getMessages<{ roomId: string, message: string }>( 'sendMessage' )
		.subscribe( async ( [ { data: { roomId, message } }, responder, { sessionId } ] ) => {
			try {
				if( message.startsWith( '/' ) ) {
					await command( sessionId, roomId, message.slice( 1 ) );
					responder.resolve( {} );
					return;
				}
				await transaction( entityManager, async transaction => {
					const nick = await getNick( sessionId, transaction );
					if( !await chatMessage( roomId, nick, message ) ) {
						throw new Error( 'Failed to send message.' );
					}
					responder.resolve( {} );
				} );
			} catch( ex ) {
				console.error( ex );
				responder.reject( ex );
			}
		} );

		socketManager.getMessages<{ name: string }>( 'createRoom' )
		.subscribe( async ( [ { data: { name } }, responder, { sessionId } ] ) => {
			try {
				await transaction( entityManager, async transaction => {
					const room = await createRoom( name, transaction );
					responder.resolve( room );
				} );
			} catch( ex ) {
				console.error( ex );
				responder.reject( ex );
			}
		} );

		socketManager.getMessages<{ roomId: string }>( 'joinRoom' )
		.subscribe( async ( [ { data: { roomId } }, responder, { sessionId } ] ) => {
			try {
				await transaction( entityManager, async transaction => {
					const room = await getRoom( roomId, transaction );
					await joinRoom( sessionId, roomId, transaction );
					await flushUpdate( room, [ sessionId ], transaction );
					responder.resolve( { room } );
				} );
			} catch( ex ) {
				console.error( ex );
				responder.reject( ex );
			}
		} );

		socketManager.getMessages<{ roomId: string }>( 'leaveRoom' )
		.subscribe( async ( [ { data: { roomId } }, responder, { sessionId } ] ) => {
			try {
				await transaction( entityManager, async transaction => {
					await leaveRoom( sessionId, roomId, transaction );
					cleanupRooms( transaction );
					responder.resolve( {} );
				} );
			} catch( ex ) {
				console.error( ex );
				responder.reject( ex );
			}
		} );
		/*
			flushRooms( socket );
		} );

		/*
		app.use( ( req, res, next ) => {
			console.log( req.method, req.url );
			next();
		} );
		*/

		app.use( compression(), express.static( 'client' ) );
		app.use( compression(), index( 'client' ) );

		app.use( '/lib', compression(), express.static( 'node_modules' ) );
		app.use( '/lib', compression(), index( 'node_modules' ) );

		app.listen( NODE_PORT, NODE_IP, () => {
			console.log( `Application worker ${process.pid} started...` );
		} );
	} catch( ex ) {
		console.error( ex );
	}
} )();
