import './error-handler';
import './polyfills';

import { createConnection, EntityManager, DeepPartial } from 'typeorm';
import { Subject, interval, of } from 'rxjs';
import { onErrorResumeNext, mergeMap, take, tap, takeUntil } from 'rxjs/operators';
import { fromNodeEvent } from './rxjs';
import { isValidNick, isValidRoomName } from 'src/validation';
import { GameEntity } from './game.entity';
import { GameStateEntity } from './game-state.entity';
import { LoginEntity } from './login.entity';
import { RoomEntity } from './room.entity';
import { SessionEntity } from './session.entity';
import { UserEntity } from './user.entity';
import { Game } from 'src/game';
import { ruleSetMap } from 'src/rule-sets';
import { app } from './app';
import { colors } from 'data/colors.yaml';
import { connectionOptions, cleanup as cleanupConfig } from 'data/config.yaml';
import uuid from 'uuid/v4';
import moment from 'moment';
import assert from 'assert';

const { OPENSHIFT_REDIS_HOST,
		OPENSHIFT_REDIS_PASSWORD,
		OPENSHIFT_REDIS_PORT
} = process.env;

type CallbackEvent<T = {}, U = {}> = [ T, ( error: Error|null, value: U|null ) => void ];

const server = require( 'http' ).Server( app ),
	io = require( 'socket.io' )( server ) as SocketIO.Server & NodeJS.EventEmitter;

io.engine[ 'generateId' ] = uuid;

if( OPENSHIFT_REDIS_HOST ) {
	const redis = require( 'redis' ).createClient,
		adapter = require( 'socket.io-redis' ),
		pub = redis( OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, { auth_pass: OPENSHIFT_REDIS_PASSWORD } ),
		sub = redis( OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, { return_buffers: true, auth_pass: OPENSHIFT_REDIS_PASSWORD } );

	io.adapter( adapter( { pubClient: pub, subClient: sub } ) );
}

function getSocket( sessionId: string ) {
	return Object.entries( io.of( '/' ).connected )
	.filter( ( [ id, socket ] ) => id === sessionId )
	.map( ( [ id, socket ] ) => socket )[ 0 ]
	|| null;
}

async function getJoinedRoomIds( manager: EntityManager, sessionId: string ) {
	const socket = getSocket( sessionId );
	if( !socket ) return [];
	const rooms = await manager.findByIds( RoomEntity, Object.keys( socket.rooms ) );
	return rooms.map( room => room.id );
}

async function joinRoom( manager: EntityManager, roomId: string, sessionId: string ) {
	const socket = getSocket( sessionId );
	await new Promise( ( resolve, reject ) => {
		socket.join( roomId, err => {
			if( err ) { reject( err ); }
			else { resolve(); }
		} );
	} );
	await flushJoinedRooms( manager, sessionId );
	await flushUpdate( manager, roomId, sessionId );
	const { nick } = await manager.findOne( SessionEntity, sessionId, { select: [ 'nick' ] } );
	await statusMessage( roomId, `${nick} has joined the room.` );
}

async function flushJoinedRooms( manager: EntityManager, sessionId: string ) {
	const roomIds = await getJoinedRoomIds( manager, sessionId );
	io.to( sessionId ).emit( 'joinedRooms', roomIds );
}

async function flushRooms( manager: EntityManager, sessionId?: string ) {
	const rooms = ( await manager.find( RoomEntity ) ).map( RoomEntity.toRoom );
	const emitter = sessionId ? io.to( sessionId ) : io;
	emitter.emit( 'rooms', rooms );
}

async function leaveRoom( manager: EntityManager, sessionId: string, roomId: string ) {
	const socket = getSocket( sessionId );
	await new Promise( ( resolve, reject ) => {
		socket.leave( roomId, err => {
			if( err ) {
				reject( err );
			} else {
				resolve();
			}
		} );
	} );
	await flushJoinedRooms( manager, sessionId );
	const { nick } = await manager.findOne( SessionEntity, sessionId, { select: [ 'nick' ] } );
	await statusMessage( roomId, `${nick} has left the room.` );
}

function statusMessage( message: string, roomId: string, sessionId?: string ) {
	io.to( sessionId || roomId ).emit( 'message', { roomId, message } );
	return true;
}

function chatMessage( user: string, message: string, roomId: string ) {
	io.to( roomId ).emit( 'message', { roomId, user, message } );
	return true;
}

async function flushUpdate( manager: EntityManager, roomId: string, sessionId?: string ) {
	await transaction( manager, async manager => {
		const room = await manager.findOne( RoomEntity, roomId);
		if( !room ) return;
		const game = await manager.findOne( GameEntity, room.gameId, { relations: [ 'gameStates' ] } );
		if( !game ) return;
		io.to( sessionId || room.id ).emit( 'update', GameEntity.toGame( game ).serialize() );
	} );
}

async function cleanupRooms( manager: EntityManager ) {
	await transaction( manager, async manager => {
		let removed = 0;
		const promises = [] as Promise<{}>[];
		for( const room of await manager.find( RoomEntity, { select: [ 'id', 'expires' ] } ) ) {
			if( Object.values( io.of( room.id ).sockets ).length === 0 ) {
				if( room.expires ) {
					if( moment( room.expires ).isSameOrBefore() ) {
						console.log( `Deleting room ${room.id}...` );
						promises.push( manager.remove( room ) );
						++removed;
					}
				} else {
					const expires = moment().add( cleanupConfig.rooms.expireSeconds, 's' );
					console.log( `Queuing room ${room.id} for deletion ${expires.fromNow()}...` );
					room.expires = expires.toDate();
					promises.push( manager.save( room ) );
				}
			}
		}
		await Promise.all( promises );
		if( removed ) await flushRooms( manager );
	} );
}

async function newGame( manager: EntityManager, roomId: string, ruleSet: RuleSet ) {
	statusMessage( 'New game', roomId );
	const rules = ruleSetMap.get( ruleSet );
	return await transaction( manager, async manager => {
		const game = rules.newGame( uuid() );
		const gameEntity = await manager.create( GameEntity, { id: game.gameId, colors: [ ...game.colors ] } );
		gameEntity.ruleSet = rules.ruleSet;
		await manager.save( gameEntity );
		await saveGameStates( manager, game );
		await manager.update( RoomEntity, roomId, { gameId: gameEntity.id } );
		flushRooms( manager );
		flushUpdate( manager, roomId );
		return game;
	} );
}

async function saveGameStates( manager: EntityManager, game: Game ) {
	return await transaction( manager, async manager => {
		const gameStates =
			await Promise.all(
				game.gameStates.map( ( gs, index ) => manager.preload( GameStateEntity, {
					gameId: game.gameId,
					index,
					boardData: ''
				} ) )
			);
		await manager.update( GameEntity, game.gameId, { gameStates } );
	} );
}

const transaction = ( () => {
	let m: EntityManager = null;
	return ( <T>( manager: EntityManager, fn: ( manager: EntityManager ) => Promise<T> ) => {
		assert( manager );
		if( m ) {
			return fn( m );
		} else {
			return manager.transaction<T>( async manager => {
				m = manager;
				try {
					return await fn( m );
				} finally {
					m = null;
				}
			} );
		}
	} );
} )();

async function createRoom( manager: EntityManager, sessionId: string, name: string, password: string ) {
	if( !isValidRoomName( name ) ) throw new Error( 'Invalid room name.' );
	return await transaction( manager, async manager => {
		const roomEntity =
			await manager.create( RoomEntity, {
				name,
				password
			} );
		await manager.save( roomEntity );
		await flushRooms( manager );
		await flushJoinedRooms( manager, sessionId );
		await newGame( manager, roomEntity.id, RuleSet.standard );
		return roomEntity;
	} );
}

async function makeMove( manager: EntityManager, roomId: string, position: Point ) {
	return await transaction( manager, async manager => {
		const roomEntity = await manager.findOne( RoomEntity, roomId );
		const gameEntity = await manager.findOne( GameEntity, roomEntity.gameId, { relations: [ 'gameStates' ] } );
		const rules = ruleSetMap.get( gameEntity.ruleSet );
		const game = GameEntity.toGame( gameEntity );
		if( !rules.makeMove( game, position ) ) {
			return false;
		}
		await saveGameStates( manager, game );
		const { currentGameState: gameState } = game,
			{ board } = gameState!;
		if( rules.isGameOver( board ) ) {
			const scores =
			Array.from( { length: rules.colors } )
			.map( ( _, color ) => ( {
				color: color[ game.colors[ color ] ].displayName,
				score: rules.getScore( board, color )
			} ) );
			scores.sort( ( c1, c2 ) => {
				const r1 = rules.compare( c1.score, c2.score );
				return r1 === 0 ? c1.color.localeCompare( c2.color ) : r1;
			} );
			const bestScore = scores[ 0 ].score;
			const winners = scores.filter( ( { score } ) => rules.compare( score, bestScore ) );
			let message: string;
			if( winners.length !== 1 ) {
				message = 'Draw game.';
			} else {
				message = `${winners[ 0 ].color} wins.`;
			}
			await statusMessage( `${message}:\n${scores.map(({color, score})=>`${color}: ${score}`).join('\n')}`, roomId );
		}
		await flushUpdate( manager, roomId );
		return true;
	} );
}

( async () => {
	try {
		const { manager } = await createConnection( {
			...connectionOptions,
			entities: [ GameEntity, GameStateEntity, LoginEntity, RoomEntity, SessionEntity, UserEntity ]
		} );

		interval( moment.duration( cleanupConfig.rooms.checkSeconds, 's' ).asMilliseconds() )
		.subscribe( async () => {
			cleanupRooms( manager );
		} );

		let connections = 0;

		fromNodeEvent<SocketIO.Socket>( io, 'connection' )
		.subscribe( async socket => {
			console.log( `User connected, ${++connections} connected, ${socket.id}` );

			const disconnecting = fromNodeEvent( socket, 'disconnecting' ).pipe( take( 1 ) );
			const disconnected = fromNodeEvent( socket, 'disconnect' ).pipe( take( 1 ) );

			function handleCallbackEvent<T extends object = {}, U = {}>( eventName: string, fn: ( value: T & { manager: EntityManager } ) => PromiseLike<U|void> ) {
				const result = new Subject<U>();
				fromNodeEvent<CallbackEvent<T, U>>( socket, eventName )
				.pipe(
					takeUntil( disconnected ),
					mergeMap<CallbackEvent<T, U>, {}>( ( [ value, callback ] ) =>
						of( value )
						.pipe(
							mergeMap( value => transaction( manager, async manager => fn( { manager, ...( value as any ) } ) ) ),
							tap( {
								next( value ) {
									callback( null, ( value == null ) ? {} as any : value );
								},
								error( err ) {
									console.error( err );
									callback( ( err == null ) ? {} : err.message, null );
								}
							} ),
							onErrorResumeNext()
						)
					),
				)
				.subscribe( result );
				return result;
			}

			const sessionId = socket.id;
			await manager.save(
				await manager.create( SessionEntity, { id: sessionId, nick: 'Guest' } )
			);

			disconnecting.subscribe( async () => {
				await transaction( manager, async manager => {
					try {
						const roomIds = await getJoinedRoomIds( manager, sessionId );
						if( roomIds.length > 0 ) {
							const { nick } = await manager.findOne( SessionEntity, sessionId, { select: [ 'nick' ] } );
							await Promise.all(
								roomIds.map( roomId => statusMessage( `${nick} has disconnected.`, roomId ) )
							);
						}
					} finally {
						manager.delete( SessionEntity, sessionId );
					}
				} );
			} );

			disconnected.subscribe( async () => {
				console.log( `User disconnected, ${--connections} connected` );
			} );


			const commands = {
				async help( roomId: string ) {
					await statusMessage( `Available commands:
/?
/help
/nick <name>
/quit
/who
`, roomId, sessionId );
				},
				async '?'( roomId: string ) {
					await commands.help( roomId );
				},
				async nick( roomId: string, nick: string ) {
					if( !isValidNick( nick ) ) throw new Error( 'Invalid nick.' );

					let previousNick: string;
					await transaction( manager, async manager => {
						const session = await manager.findOne( SessionEntity, sessionId );
						const existingSession = ( await manager.count( SessionEntity, { nick } ) ) > 0;
						const existingUser = ( await manager.count( UserEntity, { nick } ) ) > 0;
						if( existingSession || existingUser ) {
							throw new Error( 'Nick is already in use.' );
						}
						previousNick = session.nick;
						session.nick = nick;
						if( session.userId ) {
							await manager.update( UserEntity, session.userId, { nick } );
						}
						await manager.save( session );
					} );

					await statusMessage( `${previousNick} is now known as ${nick}.`, roomId );
				},
				async quit( roomId: string ) {
					await leaveRoom( manager, sessionId, roomId );
				},
				async who( roomId: string ) {
					const clients = await new Promise<string[]>( ( resolve, reject ) => {
						io.in( roomId ).clients( ( err, clients ) => {
							if( err ) reject( err );
							else resolve( clients );
						} );
					} );
					const sessions = await manager.findByIds( SessionEntity, clients );
					const nicks = sessions.map( s => s.nick ).sort();
					await statusMessage( `Users in room:\n${nicks.join('\n')}`, roomId, sessionId );
				}
			};

			async function command( roomId: string, raw: string ) {
				const [ cmd, ...params ] = raw.trim().split( /\s+/g );
				try {
					if( !commands.hasOwnProperty( cmd ) ) throw new Error( 'Unknown command.' );
					const joinedRoomIds = await getJoinedRoomIds( manager, sessionId );
					if( !joinedRoomIds.includes( roomId ) ) throw new Error( 'Not in room.' );
					await commands[ cmd ]( roomId, ...params );
				} catch( ex ) {
					if( ex && ex.message ) {
						await statusMessage( ex.message, roomId, sessionId );
					}
					throw ex;
				}
			}

			handleCallbackEvent<{ roomId: string; position: Point; }>( 'makeMove', async ( { roomId, position } ) => {
				if( !await makeMove( manager, roomId, position ) ) throw new Error( 'Failed to make move.' );
			} );

			handleCallbackEvent<{ roomId: string; ruleSet: RuleSet }>( 'newGame', async ( { roomId, ruleSet } ) => {
				const game = await newGame( manager, roomId, ruleSet );
				if( !game ) throw new Error( 'Failed to create game.' );
				return { game: game.serialize() };
			} );

			handleCallbackEvent<{ roomId: string; message: string; }>( 'sendMessage', async ( { roomId, message } ) => {
				if( message.startsWith( '/' ) ) {
					await command( roomId, message.slice( 1 ) );
					return;
				}
				const { nick } = await manager.findOne( SessionEntity, sessionId, { select: [ 'nick' ] } );
				if( !await chatMessage( nick, message, roomId ) ) throw new Error( 'Failed to send message.' );
			} );

			handleCallbackEvent<{ name: string; password: string; }>( 'createRoom', async ( { manager, name, password } ) => {
				const roomEntity = await createRoom( manager, sessionId, name, password );
				await joinRoom( manager, roomEntity.id, sessionId );
				return RoomEntity.toRoom( roomEntity );
			} );

			handleCallbackEvent<{ roomId: string; password: string; }>( 'joinRoom', async ( { manager, roomId, password } ) => {
				const roomEntity = await manager.findOne( RoomEntity, roomId );
				if( !roomEntity ) throw new Error( 'Failed to join room.' );
				if( roomEntity.password ) {
					if( !password ) throw new Error( 'Room requires a password.' );
					// TODO: hash
					if( roomEntity.password !== password ) throw new Error( 'Incorrect password.' );
				}
				manager.update( RoomEntity, roomId, { expires: null } );
				await joinRoom( manager, roomId, sessionId );
				return RoomEntity.toRoom( roomEntity );
			} );

			handleCallbackEvent<{ roomId: string; }>( 'leaveRoom', async ( { manager, roomId } ) => {
				await leaveRoom( manager, sessionId, roomId );
			} );

			flushRooms( manager, sessionId );
		} );
	} catch( ex ) {
		console.error( ex );
	}
} )();

server.listen( app.get( 'port' ), app.get( 'host' ), err => {
	if( err ) {
		console.error( err );
		return;
	}
	const { address, port } = server.address();
	console.log( `Process ${process.pid} listening at ${address}:${port}...` );
} );
