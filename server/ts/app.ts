import 'source-map-support/register';
import 'core-js';
import 'reflect-metadata';

import { EventEmitter } from 'events';
import { getConnectionManager } from 'typeorm';
import uuid = require( 'uuid' );
import { GameEntity, GameStateEntity, LoginEntity, RoomEntity, SessionEntity, UserEntity } from './entities/index';
import Game from './game';
import GameState from './game-state';
import Board from './board';
import Rules from './rules';
import express = require( 'express' );
import { Socket } from './socket';
import { SocketManager } from './socket-manager';
import index = require( 'serve-index' );

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
				entities: [ `${__dirname}/entities/index.js` ],
				namingStrategies: [ require( './naming-strategies/index' ).R3NamingStrategy ],
				usedNamingStrategy: 'R3NamingStrategy',
				logging: {
					logSchemaCreation: true,
					logQueries: true
				}
			} );
		await connection.connect();
		await connection.syncSchema();
		const { entityManager } = connection,
			userId = uuid.v4();

		await entityManager.transaction( async transaction => {
			await transaction.persist(
				new UserEntity( {
					userId,
					nick: 'error'
				} )
			);
			await transaction.persist( new LoginEntity( {
				userId,
				username: 'error',
				passwordHash: ''
			} ) );
		} );

		const socketManager = new SocketManager;

		function isValidNick( nick: string ) {
			console.log( 'isValidNick', ...arguments );
			if( !nick ) {
				return false;
			}
			return /^[_a-z][-_a-z0-9]{1,34}[_a-z0-9]+/i.test( nick );
		}

		async function usersInRoom( roomId: string ) {
			console.log( 'usersInRoom', ...arguments );
			const [ , count ] =
				await entityManager.findAndCount( SessionEntity, session => session.rooms.some( room => room.roomId === roomId ) );
			return count;
		}

		async function cleanupRooms() {
			console.log( 'cleanupRooms', ...arguments );
			let removed = 0;
			await entityManager.transaction( async transaction => {
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
			} );
			if( removed ) {
				flushRooms();
			}
		}

		async function flushRooms( sessionIds?: string[] ) {
			console.log( 'flushRooms', ...arguments );
			const roomEntities = await entityManager.find( RoomEntity );
			socketManager.send( sessionIds!, 'rooms', roomEntities.map( room => ( {
				roomId: room.roomId,
				name: room.name
			} ) ) );
		}

		async function flushUpdate( room: Room, sessionIds?: string[] ) {
			console.log( 'flushUpdate', ...arguments );
			const game = await getGame( room.gameId );
			socketManager.send( sessionIds!, 'update', game.serialize() );
		}

		async function getGame( gameId: string ) {
			console.log( 'getGame', ...arguments );
			const gameRecord = await entityManager.findOneById( GameEntity, gameId );
			if( !gameRecord ) {
				throw new Error( `Game ${gameId} not found.` );
			}
			const game = new Game( gameRecord.gameId );
			game.gameStates.splice( 0, 0, ...( gameRecord.gameStates || [] ).map( g => {
				return new GameState;
			} ) ); 
			return game;
		}

		async function newGame( roomEntity: RoomEntity ) {
			console.log( 'newGame', ...arguments );
			statusMessage( roomEntity.roomId, 'New game' );
			const gameId = uuid.v4(),
				gameEntity = new GameEntity( { gameId } ),
				game = rules.newGame( gameId );
			Object.assign( roomEntity, { gameId } );
			await entityManager.transaction( async transaction => {
				await transaction.persist( gameEntity );
				await transaction.persist( roomEntity );
			} );
			await flushRooms();
			await flushUpdate( roomEntity );
			return game;
		}

		async function createRoom( name: string ) {
			console.log( 'createRoom', ...arguments );
			const roomId = uuid.v4(),
				roomEntity =
					new RoomEntity( {
						roomId,
						name
					} ),
				game = await newGame( roomEntity );
			await flushRooms();
			return roomEntity;
		}

		async function makeMove( room: RoomEntity, position: Point ) {
			console.log( 'makeMove', ...arguments );
			const game = await getGame( room.gameId );
			if( !rules.makeMove( game, position ) ) {
				return false;
			}
			const { roomId } = room,
				{ currentGameState: gameState } = game,
				{ board } = gameState!;
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
			await flushUpdate( room );
			return true;
		}

		function statusMessage( roomId: string, message: string, sessionIds?: string[] ) {
			console.log( 'statusMessage', ...arguments );
			socketManager.send( sessionIds!, 'message', { roomId, message } );
			return true;
		}

		function chatMessage( roomId: string, user: string, message: string, sessionIds?: string[] ) {
			console.log( 'chatMessage', ...arguments );
			socketManager.send( sessionIds!, 'message', { roomId, user, message } );
			return true;
		}

		app.param( 'sessionId', ( req, res, next, sessionId ) => {
			req[ 'sessionId' ] = sessionId || uuid();
			next();
		} );

		async function getSession( sessionId: string ) {
			console.log( 'getSession', ...arguments );
			const session = await entityManager.findOneById( SessionEntity, sessionId );
			if( !session ) throw new Error( `Session ${sessionId} not found` );
			return session;
		}

		async function getUser( sessionId: string ) {
			console.log( 'getUser', ...arguments );
			const { user } = await getSession( sessionId );
			return user;
		}

		async function getNick( sessionId: string ) {
			console.log( 'getNick', ...arguments );
			const user = await getUser( sessionId );
			if( user ) {
				return user.nick;
			} else {
				return 'Guest';
			}
		}

		async function flushJoinedRooms( sessionId: string ) {
			console.log( 'flushJoinedRooms', ...arguments );
			const session = await getSession( sessionId );
			socketManager.send( [ sessionId ], 'joinedRooms', ( session.rooms || [] ).map( room => room.roomId ) );
		}

		async function leaveRoom( sessionId: string, roomId: string ) {
			console.log( 'leaveRoom', ...arguments );
			const session = await getSession( sessionId );
			session.rooms = session.rooms!.filter( room => room.roomId !== roomId );
			await entityManager.persist( session );
			const nick = await getNick( sessionId );
			await flushJoinedRooms( sessionId );
			await statusMessage( roomId, `${nick} has left the room.` );
		}

		async function joinRoom( sessionId: string, roomId: string ) {
			console.log( 'joinRoom', ...arguments );
			const session = await getSession( sessionId );
			const room = await entityManager.findOneById( RoomEntity, { roomId } );
			if( !room ) {
				throw new Error( `Room ${roomId} not found.` );
			}
			session.rooms.push( room );
			await entityManager.persist( session );
			const nick = await getNick( sessionId );
			await flushJoinedRooms( sessionId );
			await statusMessage( roomId, `${nick} has joined the room.` );
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
				const user = await getUser( sessionId );
				if( !user ) {
					throw new Error( 'You must be logged in.' );
				}
				if( !isValidNick( nick ) ) {
					throw new Error( 'Invalid nick.' );
				}
				const previousNick = await user.nick;
				user.nick = nick;
				await entityManager.persist( UserEntity, user );
				await statusMessage( roomId, `${previousNick} is now known as ${nick}.` );
			},
			async quit( sessionId: string, roomId: string ) {
				await leaveRoom( sessionId, roomId );
			}
		};
		async function command( sessionId: string, roomId: string, raw: string ) {
			console.log( 'command', ...arguments );
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

		app.ws( '/ws/:sessionId', async ( ws, req ) => {
			const sessionId = req[ 'sessionId' ] as string;
			await entityManager.transaction( async transaction => {
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
				const room = await entityManager.findOneById( RoomEntity, roomId );
				if( !room ) {
					throw new Error( `Room ${roomId} not found.` );
				}
				if( !await makeMove( room, position ) ) {
					throw new Error( 'Failed to make move.' );
				}
				responder.resolve( {} );
			} catch( ex ) {
				console.error( ex );
				responder.reject( ex );
			}
		} );

		socketManager.getMessages<{ roomId: string }>( 'newGame' )
		.subscribe( async ( [ { data: { roomId } }, responder, { sessionId } ] ) => {
			try {
				const room = await entityManager.findOneById( RoomEntity, roomId );
				if( !room ) {
					throw new Error( `Room ${roomId} not found.` );
				}
				const game = await newGame( room );
				if( !game ) {
					throw new Error( 'Failed to create game.' );
				}
				responder.resolve( { game: game.serialize() } );
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
				const nick = await getNick( sessionId );
				if( !await chatMessage( roomId, nick, message ) ) {
					throw new Error( 'Failed to send message.' );
				}
				responder.resolve( {} );
			} catch( ex ) {
				console.error( ex );
				responder.reject( ex );
			}
		} );

		socketManager.getMessages<{ name: string }>( 'createRoom' )
		.subscribe( async ( [ { data: { name } }, responder, { sessionId } ] ) => {
			try {
				const room = await createRoom( name );
				responder.resolve( room );
			} catch( ex ) {
				console.error( ex );
				responder.reject( ex );
			}
		} );

		socketManager.getMessages<{ roomId: string }>( 'joinRoom' )
		.subscribe( async ( [ { data: { roomId } }, responder, { sessionId } ] ) => {
			try {
				const room = await entityManager.findOneById( RoomEntity, roomId );
				if( !room ) {
					throw new Error( 'Failed to join room.' );
				}
				await joinRoom( sessionId, roomId );
				await flushUpdate( room, [ sessionId ] );
				responder.resolve( { room } );
			} catch( ex ) {
				console.error( ex );
				responder.reject( ex );
			}
		} );

		socketManager.getMessages<{ roomId: string }>( 'leaveRoom' )
		.subscribe( async ( [ { data: { roomId } }, responder, { sessionId } ] ) => {
			try {
				await leaveRoom( sessionId, roomId );
				responder.resolve( {} );
			} catch( ex ) {
				console.error( ex );
				responder.reject( ex );
			}
			setTimeout( () => { cleanupRooms(); }, 0 );
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
