import './polyfills';
import { createConnection } from 'typeorm';

const { NODE_PORT = 3000, NODE_IP = 'localhost',
		OPENSHIFT_REDIS_HOST,
		OPENSHIFT_REDIS_PASSWORD,
		OPENSHIFT_REDIS_PORT
	} = process.env;
import uuid from 'uuid/v4';

import { GameEntity } from 'server/entities/game';
import { GameStateEntity } from 'server/entities/game-state';
import { LoginEntity } from 'server/entities/login';
import { RoomEntity } from 'server/entities/room';
import { SessionEntity } from 'server/entities/session';
import { UserEntity } from 'server/entities/user';
import { Game } from 'src/game';
import { GameState } from 'src/game-state';
import { Board } from 'src/board';
import { Rules } from 'src/rules';
import express from 'express';
import csp from 'express-csp';
import path from 'path';
import { cspPolicy } from 'data/config.yaml';

const app = express();
import index  from 'serve-index';
import compression from 'compression';
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

( async () => {
	try {
		const connection = await createConnection( {
			type: 'sqlite',
			database: ':memory:',
			synchronize: true,
			entities: [ GameEntity, GameStateEntity, LoginEntity, RoomEntity, SessionEntity, UserEntity ],
			logging: [ 'schema', 'warn', 'error' ]
		} );

		const { manager: entityManager } = connection;

		const user =
		await entityManager.create( UserEntity, {
			nick: 'error'
		} );

		await entityManager.save( user );

		const login =
		await entityManager.create( LoginEntity, {
			userId: user.userId,
			username: 'error',
			passwordHash: ''
		} );

		await entityManager.save( login );

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
			const gameRecord = await entityManager.findOne( GameEntity, gameId );
			const game = new Game( gameRecord.gameId );
			game.gameStates.splice( 0, 0, ...( gameRecord.gameStates || [] ).map( g => {
				return new GameState;
			} ) );
			return game;
		}

		async function newGame( room: RoomEntity ) {
			statusMessage( room.roomId, 'New game' );
			const gameEntity = await entityManager.create( GameEntity, {} ),
				game = rules.newGame( gameEntity.gameId );
			room.gameId = gameEntity.gameId;
			flushRooms();
			flushUpdate( room );
			return game;
		}

		async function createRoom( name: string ) {
			const gameEntity = await entityManager.create( GameEntity, {} );
			await entityManager.save( gameEntity );
			const roomEntity =
					await entityManager.create( RoomEntity, {
						gameId: gameEntity.gameId,
						name,
						password: ''
					} );
			await entityManager.save( roomEntity );
			const game = await newGame( roomEntity );
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
			const user = await entityManager.save( await entityManager.create( UserEntity, { nick: 'Guest' } ) );
			const { userId } = user;
			const { sessionId } = await entityManager.save(
				await entityManager.create( SessionEntity, { userId } )
			);

			async function getCurrentSession() {
				return await entityManager.findOne( SessionEntity, sessionId );
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
					( session.rooms || [] ).map( room => room.roomId )
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
					await entityManager.save( user );
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
				for( const { roomId } of ( session.rooms || [] ) ) {
					statusMessage( roomId, `${nick} has disconnected.` );
				}
				setTimeout( () => { cleanupRooms(); }, 0 );
			} );

			socket.on( 'makeMove', async ( { roomId, position }, callback ) => {
				try {
					const room = await entityManager.findOne( RoomEntity, roomId );
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
					const room = await entityManager.findOne( RoomEntity, roomId );
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
					const room = await entityManager.findOne( RoomEntity, roomId );
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

		app.use( ( req, res, next ) => {
			console.log( req.method, req.url );
			next();
		} );

		app.use( compression(), express.static( path.join( __dirname, 'www' ) ) );
		csp.extend( app, cspPolicy );

		server.listen( NODE_PORT, NODE_IP, () => {
			console.log( `Application worker ${process.pid} started...` );
		} );
	} catch( ex ) {
		console.error( ex );
	}
} )();
