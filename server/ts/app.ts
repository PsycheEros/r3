import 'source-map-support/register';
import 'core-js';
import 'reflect-metadata';

import { getConnectionManager } from 'typeorm';

const { NODE_PORT = 3000, NODE_IP = 'localhost',
		OPENSHIFT_REDIS_HOST,
		OPENSHIFT_REDIS_PASSWORD,
		OPENSHIFT_REDIS_PORT
	} = process.env;
import uuid = require( 'uuid' );

import { GameEntity, GameStateEntity, LoginEntity, RoomEntity, SessionEntity, UserEntity } from './entities/index';
import Game from './game';
import GameState from './game-state';
import Board from './board';
import Rules from './rules';
import express = require( 'express' );

const app = express();
import index = require( 'serve-index' );
const compression = require( 'compression' );
const server = require( 'http' ).Server( app ),
	io = require( 'socket.io' )( server ) as SocketIO.Server,
	rules = new Rules;

if( OPENSHIFT_REDIS_HOST ) {
	const redis = require( 'redis' ).createClient,
		adapter = require( 'socket.io-redis' ),
		pub = redis( OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, { auth_pass: OPENSHIFT_REDIS_PASSWORD } ),
		sub = redis( OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, { return_buffers: true, auth_pass: OPENSHIFT_REDIS_PASSWORD } );

	io.adapter( adapter( { pubClient: pub, subClient: sub } ) );
}

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
			user =
				await entityManager.create( UserEntity, {
					userId: uuid.v4(),
					nick: 'error'
				} ),
			login =
				await entityManager.create( LoginEntity, {
					loginId: uuid.v4(),
					userId: user.userId,
					username: 'error',
					passwordHash: ''
				} );
		await entityManager.persist( UserEntity, user );
		await entityManager.persist( LoginEntity, login ); 

		type Session = {
			socket: SocketIO.Client
		};

		function isValidNick( nick: string ) {
			if( !nick ) {
				return false;
			}
			return /^[_a-z][-_a-z0-9]{1,30}[_a-z0-9]+/i.test( nick );
		}

		function usersInRoom( roomId: string ): number {
			const room = io.nsps[ '/' ].adapter.rooms[ roomId ];
			if( room ) {
				return Object.keys( room.sockets ).length;
			} else {
				return 0;
			}
		}

		async function cleanupRooms() {
			let removed = 0;
			for( const room of await entityManager.getRepository( RoomEntity ).find() ) {
				if( room.sessions.length <= 0 ) {
					const { roomId } = room;
					console.log( `Deleting room ${roomId}...` );
					await entityManager.remove( room );
					++removed;
				}
			}
			if( removed ) {
				flushRooms();
			}
		}

		type Target = {
			emit: Function;
		};

		async function flushRooms( target: Target = io ) {
			target.emit( 'rooms', await entityManager.find( RoomEntity ) );
		}

		async function flushUpdate( room: Room, target: Target = io.to( room.roomId ) ) {
			const game = await getGame( room.gameId );
			target.emit( 'update', game.serialize() );
		}

		async function getGame( gameId: string ) {
			const gameRecord = await entityManager.findOneById( GameEntity, gameId );
			const game = new Game( gameRecord.gameId );
			game.gameStates.splice( 0, 0, ...gameRecord.gameStates.map( g => {
				return new GameState;
			} ) ); 
			return game;
		}

		async function newGame( room: RoomEntity ) {
			statusMessage( room.roomId, 'New game' );
			const gameId = uuid.v4(),
				gameEntity = await entityManager.create( GameEntity, { gameId } ),
				game = rules.newGame( gameId );
			room.gameId = gameId;
			flushRooms();
			flushUpdate( room );
			return game;
		}

		async function createRoom( name: string ) {
			const roomId = uuid.v4(),
				gameId = uuid.v4(),
				gameEntity =
					await entityManager.create( GameEntity, {
						gameId
					} ),
				roomEntity =
					await entityManager.create( RoomEntity, {
						roomId,
						gameId,
						name
					} ),
				game = await newGame( roomEntity );
			await entityManager.persist( GameEntity, gameEntity );
			await entityManager.persist( RoomEntity, roomEntity );
			await flushRooms();
			return roomEntity;
		}

		async function makeMove( room: RoomEntity, position: Point ) {
			const game = await getGame( room.gameId );
			if( !rules.makeMove( game, position ) ) {
				return;
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


		function statusMessage( roomId: string, message: string, socket?: SocketIO.Socket ) {
			if( socket ) {
				socket.emit( 'message', { roomId, message } );
			} else {
				io.to( roomId ).emit( 'message', { roomId, message } );
			}
			return true;
		}

		function chatMessage( roomId: string, user: string, message: string ) {
			io.to( roomId ).emit( 'message', { roomId, user, message } );
			return true;
		}

		let connections = 0;
		io.on( 'connection', async ( socket: SocketIO.Socket ) => {
			const sessionId = uuid.v4();
			await entityManager.persist( SessionEntity,
				await entityManager.create( SessionEntity, { sessionId } )
			);

			async function getCurrentSession() {
				return await entityManager.findOneById( SessionEntity, sessionId );
			}

			async function getCurrentUser() {
				const { user } = await getCurrentSession();
				return user;
			}

			async function getCurrentNick() {
				const user = await getCurrentUser();
				if( user ) {
					return user.nick;
				} else {
					return 'Guest';
				}
			}

			async function flushJoinedRooms() {
				const session = await getCurrentSession();
				socket.emit( 'joinedRooms',
					session.rooms.map( room => room.roomId )
				);
			}

			async function leaveRoom( roomId: string ) {
				await new Promise( ( resolve, reject ) => {
					socket.leave( roomId, err => {
						if( err ) {
							reject( err );
						} else {
							resolve();
						}
					} );
				} );
				const nick = await getCurrentNick();
				await flushJoinedRooms();
				await statusMessage( roomId, `${nick} has left the room.` );
			}

			const commands = {
				async help( roomId: string ) {
					await statusMessage( roomId, `Available commands:
/?
/help
/nick <username>
/quit
`, socket );
				},
				async '?'( roomId: string ) {
					await commands.help( roomId );
				},
				async nick( roomId: string, nick: string ) {
					const user = await getCurrentUser();
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
				async quit( roomId: string ) {
					await leaveRoom( roomId );
				}
			};
			async function command( roomId: string, raw: string ) {
				const [ cmd, ...params ] = raw.trim().split( /\s+/g );
				try {
					if( !commands.hasOwnProperty( cmd ) ) {
						throw new Error( 'Unknown command.' );
					}
					await commands[ cmd ]( roomId, ...params );
				} catch( ex ) {
					if( ex && ex.message ) {
						await statusMessage( roomId, ex.message, socket );
					}
					throw ex;
				}
			}

			console.log( `User connected, ${++connections} connected` );

			socket.on( 'disconnect', async () => {
				const session = await getCurrentSession(),
					nick = await getCurrentNick();
				for( const { roomId } of session.rooms ) {
					statusMessage( roomId, `${nick} has disconnected.` );
				}
				setTimeout( () => { cleanupRooms(); }, 0 );
			} );

			socket.on( 'makeMove', async ( { roomId, position }, callback ) => {
				try {
					const room = await entityManager.findOneById( RoomEntity, roomId );
					if( !room ) {
						throw new Error( 'Room not found.' );
					}
					if( !await makeMove( room, position ) ) {
						throw new Error( 'Failed to make move.' );
					}
					callback( null, {} );
				} catch( ex ) {
					console.error( ex );
					callback( ex.message || ex, null );
				}
			} );

			socket.on( 'newGame', async ( { roomId }, callback ) => {
				try {
					const room = await entityManager.findOneById( RoomEntity, roomId );
					if( !room ) {
						throw new Error( 'Room not found.' );
					}
					const game = await newGame( room );
					if( !game ) {
						throw new Error( 'Failed to create game.' );
					}
					callback( null, { game: game.serialize() } );
				} catch( ex ) {
					console.error( ex );
					callback( ex.message || ex, null );
				}
			} );

			socket.on( 'sendMessage', async ( { roomId, message }, callback ) => {
				try {
					if( message.startsWith( '/' ) ) {
						await command( roomId, message.slice( 1 ) );
						callback( null, {} );
						return;
					}
					const nick = await getCurrentNick();
					if( !await chatMessage( roomId, nick, message ) ) {
						throw new Error( 'Failed to send message.' );
					}
					callback( null, {} );
				} catch( ex ) {
					console.error( ex );
					callback( ex.message || ex, null );
				}
			} );

			socket.on( 'createRoom', async ( { name }, callback ) => {
				try {
					const room = await createRoom( name );
					callback( null, room );
				} catch( ex ) {
					console.error( ex );
					callback( ex.message || ex, null );
				}
			} );

			socket.on( 'joinRoom', async ( { roomId }, callback ) => {
				try {
					const room = await entityManager.findOneById( RoomEntity, roomId );
					if( !room ) {
						throw new Error( 'Failed to join room.' );
					}
					const nick = getCurrentNick();
					await new Promise( ( resolve, reject ) => {
						socket.join( room.roomId, err => {
							if( err ) { reject( err ); }
							else { resolve(); }
						} );
					} );
					await flushJoinedRooms();
					await flushUpdate( room, socket );
					await statusMessage( roomId, `${nick} has joined the room.` );
					callback( null, { room } );
				} catch( ex ) {
					console.error( ex );
					callback( ex.message || ex, null );
				}
			} );

			socket.on( 'leaveRoom', async ( { roomId }, callback ) => {
				try {
					await leaveRoom( roomId );
					callback( null, {} );
				} catch( ex ) {
					console.error( ex );
					callback( ex.message || ex, null );
				}
				setTimeout( () => { cleanupRooms(); }, 0 );
			} );

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

		server.listen( NODE_PORT, NODE_IP, () => {
			console.log( `Application worker ${process.pid} started...` );
		} );
	} catch( ex ) {
		console.error( ex );
	}
} )();
