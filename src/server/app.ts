import './error-handler';
import './polyfills';
import { createConnection, FindOneOptions } from 'typeorm';
import { Subject, fromEvent, empty, pipe, of } from 'rxjs';
import { catchError, concatMap, filter, onErrorResumeNext, map, mergeMap, switchMap, take, tap, takeUntil } from 'rxjs/operators';
import { fromNodeEvent } from './rxjs';
import { tapLog } from 'src/operators';

const { NODE_PORT = 3000, NODE_IP = 'localhost',
		OPENSHIFT_REDIS_HOST,
		OPENSHIFT_REDIS_PASSWORD,
		OPENSHIFT_REDIS_PORT
	} = process.env;

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
import sleep from 'sleep-promise';
import { connectionOptions, cspPolicy } from 'data/config.yaml';

type Eventually<T> = T|PromiseLike<T>;
type CallbackEvent<T = {}, U = {}> = [ T, ( error: Error|null, value: U|null ) => void ];

const app = express();
import index  from 'serve-index';
import compression from 'compression';
import { EventEmitter } from 'events';
const server = require( 'http' ).Server( app ),
	io = require( 'socket.io' )( server ) as SocketIO.Server & EventEmitter,
	rules = new Rules;

if( OPENSHIFT_REDIS_HOST ) {
	const redis = require( 'redis' ).createClient,
		adapter = require( 'socket.io-redis' ),
		pub = redis( OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, { auth_pass: OPENSHIFT_REDIS_PASSWORD } ),
		sub = redis( OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, { return_buffers: true, auth_pass: OPENSHIFT_REDIS_PASSWORD } );

	io.adapter( adapter( { pubClient: pub, subClient: sub } ) );
}

interface Emitter { emit( name: string, data: object ): void; }

app.use( require( 'body-parser' ).json() );

app.get( '/health', ( req, res ) => {
	res.writeHead( 200 );
	res.end();
} );

function isValidNick( nick: string ) {
	if( !nick ) {
		return false;
	}
	return /^[_a-z][-_a-z0-9]{1,30}[_a-z0-9]+/i.test( nick );
}

( async () => {
	try {
		const connection = await createConnection( {
			...connectionOptions,
			entities: [ GameEntity, GameStateEntity, LoginEntity, RoomEntity, SessionEntity, UserEntity ]
		} );

		const { manager } = connection;


		async function cleanupRooms() {
			let removed = 0;
			for( const room of await manager.getRepository( RoomEntity ).find( { relations: [ 'sessions' ] } ) ) {
				if( room.sessions.length <= 0 ) {
					const { roomId } = room;
					console.log( `Deleting room ${roomId}...` );
					await manager.remove( room );
					++removed;
				}
			}
			if( removed ) {
				flushRooms();
			}
		}

		async function flushRooms( target: Emitter = io ) {
			target.emit( 'rooms', ( await manager.find( RoomEntity ) ).map( RoomEntity.toRoom ) );
		}

		async function flushUpdate( room: RoomEntity, target: Emitter = io.to( room.roomId ) ) {
			const game = await getGame( room.gameId );
			target.emit( 'update', game.serialize() );
		}

		async function getGame( gameId: string ) {
			const gameEntity = await manager.findOne( GameEntity, gameId, { relations: [ 'gameStates' ] } );

			return Object.assign( new Game( gameEntity.gameId ), {
				gameStates: gameEntity.gameStates.map( gs => Object.assign( new GameState, {
					board: new Board
				} ) )
			} );
		}

		async function newGame( room: RoomEntity ) {
			statusMessage( room.roomId, 'New game' );
			const gameEntity = await manager.create( GameEntity, {} ),
				game = rules.newGame( gameEntity.gameId );
			room.gameId = gameEntity.gameId;
			flushRooms();
			flushUpdate( room );
			return game;
		}

		async function createRoom( sessionId: string, name: string, password: string ) {
			let room: Room;
			await manager.transaction( async manager => {
				const session = await manager.findOne( SessionEntity, sessionId, { relations: [ 'rooms' ] } );
				const gameEntity = await manager.create( GameEntity, {} );
				await manager.save( gameEntity );
				const roomEntity =
					await manager.create( RoomEntity, {
						gameId: gameEntity.gameId,
						name,
						password
					} );
				await manager.save( roomEntity );
				session.rooms = [ ...session.rooms, roomEntity ];
				await manager.save( session );
				const game = await newGame( roomEntity );
				room = RoomEntity.toRoom( roomEntity );
			} );
			await flushRooms();
			return room;
		}

		async function makeMove( room: RoomEntity, position: Point ) {
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

		fromNodeEvent<SocketIO.Socket>( io, 'connection' )
		.subscribe( async socket => {
			console.log( `User connected, ${++connections} connected` );
			const disconnected = fromNodeEvent( socket, 'disconnect' ).pipe( take( 1 ) );

			function handleCallbackEvent<T = {}, U = {}>( eventName: string, fn: ( value: T ) => PromiseLike<U|void> ) {
				const result = new Subject<U>();
				fromNodeEvent<CallbackEvent<T, U>>( socket, eventName )
				.pipe(
					takeUntil( disconnected ),
					mergeMap<CallbackEvent<T, U>, {}>( ( [ value, callback ] ) =>
						of( value )
						.pipe(
							mergeMap( fn ),
							tap( {
								next( value ) {
									callback( null, ( value == null ) ? {} as any : value );
								},
								error( err ) {
									callback( ( err == null ) ? {} : err, null );
								}
							} ),
							onErrorResumeNext()
						)
					),
				)
				.subscribe( result );
				return result;
			}

			disconnected.subscribe( async () => {
				console.log( `User disconnected, ${--connections} connected` );
				const session = await getCurrentSession( { relations: [ 'rooms' ] } );
				for( const { roomId } of session.rooms ) {
					statusMessage( roomId, `${session.nick} has disconnected.` );
				}
				sleep( 0 ).then( cleanupRooms );
			} );

			const sessionId = await ( async () => {
				const { sessionId } = await manager.save(
					await manager.create( SessionEntity, { nick: 'Guest' } )
				);
				return sessionId;
			} )();

			const getCurrentSession = ( options?: FindOneOptions<SessionEntity> ) => manager.findOne( SessionEntity, sessionId, options );
			const getCurrentUser = ( options?: FindOneOptions<UserEntity> ) => getCurrentSession().then( s => manager.findOne( UserEntity, s.userId, options ) );

			async function logIn( sessionId: string, username: string, password: string ) {
				await manager.transaction( async manager => {
					const session = await manager.findOne( SessionEntity, sessionId );
					if( !session ) throw new Error( 'Invalid session.' );
					const login = await manager.findOne( LoginEntity, { username}, { relations: [ 'user' ] } );
					// if( !( login && await compare( login.passwordHash, password ) ) ) {
					// 	throw new Error( 'Invalid username or password.' );
					// }
					session.userId = login.userId;
					session.nick = login.user.nick;
					await manager.save( session );
				} );
			}

			async function leaveRoom( roomId: string ) {
				let nick: string;
				let roomIds: string[];
				await manager.transaction( async manager => {
					const session = await manager.findOne( SessionEntity, sessionId, { relations: [ 'rooms' ] } );
					nick = session.nick;
					session.rooms = session.rooms.filter( room => room.roomId !== roomId );
					roomIds = session.rooms.map( r => r.roomId );
					manager.save( session );
				} );
				await new Promise( ( resolve, reject ) => {
					socket.leave( roomId, err => {
						if( err ) {
							reject( err );
						} else {
							resolve();
						}
					} );
				} );
				socket.emit( 'joinedRooms', roomIds );
				await statusMessage( roomId, `${nick} has left the room.` );
			}

			const commands = {
				async help( roomId: string ) {
					await statusMessage( roomId, `Available commands:
/?
/help
/nick <name>
/quit
`, socket );
				},
				async '?'( roomId: string ) {
					await commands.help( roomId );
				},
				async nick( roomId: string, nick: string ) {
					if( !isValidNick( nick ) ) throw new Error( 'Invalid nick.' );

					let previousNick: string;
					await manager.transaction( async manager => {
						const session = await manager.findOne( SessionEntity, sessionId, { relations: [ 'user' ] } );
						const { user } = session;
						const existingSession = await manager.findOne( SessionEntity, { nick } );
						const existingUser = await manager.findOne( UserEntity, { nick } );
						if( existingSession || existingUser ) {
							throw new Error( 'Nick is already in use.' );
						}
						previousNick = session.nick;
						session.nick = nick;
						if( user ) {
							user.nick = nick;
							await manager.save( user );
						}
						await manager.save( session );
					} );

					await statusMessage( roomId, `${previousNick} is now known as ${nick}.` );
				},
				async quit( roomId: string ) {
					await leaveRoom( roomId );
				}
			};

			async function command( roomId: string, raw: string ) {
				const [ cmd, ...params ] = raw.trim().split( /\s+/g );
				try {
					if( !commands.hasOwnProperty( cmd ) ) throw new Error( 'Unknown command.' );
					await commands[ cmd ]( roomId, ...params );
				} catch( ex ) {
					if( ex && ex.message ) {
						await statusMessage( roomId, ex.message, socket );
					}
					throw ex;
				}
			}

			handleCallbackEvent<{ roomId: string; position: Point; }>( 'makeMove', async ( { roomId, position } ) => {
				const room = await manager.findOne( RoomEntity, roomId );
				if( !room ) throw new Error( 'Room not found.' );
				if( !await makeMove( room, position ) ) throw new Error( 'Failed to make move.' );
			} );

			handleCallbackEvent<{ roomId: string; }>( 'newGame', async ( { roomId } ) => {
				const room = await manager.findOne( RoomEntity, roomId );
				if( !room ) throw new Error( 'Room not found.' );
				const game = await newGame( room );
				if( !game ) throw new Error( 'Failed to create game.' );
				return { game: game.serialize() };
			} );

			handleCallbackEvent<{ roomId: string; message: string; }>( 'sendMessage', async ( { roomId, message } ) => {
				if( message.startsWith( '/' ) ) {
					await command( roomId, message.slice( 1 ) );
					return;
				}
				const session = await getCurrentSession();
				if( !await chatMessage( roomId, session.nick, message ) ) throw new Error( 'Failed to send message.' );
			} );

			handleCallbackEvent<{ name: string; password: string; }>( 'createRoom', async ( { name, password } ) => {
				return await createRoom( sessionId, name, password );
			} );

			handleCallbackEvent<{ roomId: string; password: string; }>( 'joinRoom', async ( { roomId, password } ) => {
				let room: RoomEntity;
				let nick: string;
				let roomIds: string[];
				await manager.transaction( async manager => {
					const session = await getCurrentSession( { relations: [ 'rooms' ] } );
					nick = session.nick;
					room = await manager.findOne( RoomEntity, roomId );
					if( session.rooms.some( room => room.roomId === roomId ) ) {
						throw new Error( 'Already in room.' );
					}
					if( !room ) throw new Error( 'Failed to join room.' );

					if( room.password ) {
						if( !password ) throw new Error( 'Room requires a password.' );
						// TODO: hash
						if( room.password !== password ) throw new Error( 'Incorrect password.' );
					}

					session.rooms = [ ...session.rooms, room ];
					roomIds = session.rooms.map( room => room.roomId );
					manager.save( session );
				} );

				await new Promise( ( resolve, reject ) => {
					socket.join( roomId, err => {
						if( err ) { reject( err ); }
						else { resolve(); }
					} );
				} );

				socket.emit( 'joinedRooms', roomIds );
				await flushUpdate( room, socket );
				await statusMessage( room.roomId, `${nick} has joined the room.` );
				return { roomId: room.roomId, name: room.name, hasPassword: !!room.password };
			} );

			handleCallbackEvent<{ roomId: string; }>( 'leaveRoom', async ( { roomId } ) => {
				await leaveRoom( roomId );
			} )
			.subscribe( async () => {
				await sleep( 0 );
				await cleanupRooms();
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
