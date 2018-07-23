import './error-handler';
import './polyfills';

import { interval } from 'rxjs';
import { take, takeUntil, share, exhaustMap, concatMap } from 'rxjs/operators';
import { fromNodeEvent } from './rxjs';
import { promisify } from 'util';
import { isValidRoomName } from 'src/validation';
import { ruleSetMap } from 'src/rule-sets';
import { io } from './socket';
import cleanupConfig from 'data/cleanup.config.yaml';
import { colors } from 'data/colors.yaml';
import { hashPassword, checkPassword } from './security';
import _ from 'lodash';

import uuid from 'uuid/v4';
import { s2cRoom, s2cGame, s2cGameState } from './server-to-client';
import { shuttingDown } from './shut-down';
import { connectMongodb } from './mongodb';

( async () => {
	try {
		const { collections } = await connectMongodb();

		async function getNick( sessionId: string ) {
			const { nick } = await collections.sessions.findOne( { _id: sessionId }, { projection: { _id: 0, nick: 1 } } );
			return nick;
		}

		// remove ephemeral entities
		// await Promise.all( [
		// 	collections.expirations.deleteMany( {} ),
		// 	collections.sessions.deleteMany( {} ),
		// 	collections.rooms.deleteMany( {} ),
		// 	collections.roomSessions.deleteMany( {} )
		// ] );

		async function sendRooms( emitter: Emitter = io ) {
			emitter.emit( 'rooms',
				( await collections.rooms.find( {} ).toArray() )
				.map( s2cRoom )
			);
		}

		async function sendJoinedRooms( sessionId: string ) {
			io.to( `session:${sessionId}` )
			.emit( 'joinedRooms',
				( await collections.roomSessions.find( { sessionId } ).project( { roomId: 1 } ).toArray() )
				.map( r => r.roomId )
			);
		}

		let connections = 0;

		fromNodeEvent<SocketIO.Socket>( io, 'connection' )
		.subscribe( async socket => {
			console.log( `User connected, ${++connections} connected, ${socket.id}` );
			const sessionId = socket.id;
			await collections.sessions.insertOne( { _id: sessionId, nick: 'Guest' } as ServerSession );
			socket.join( `session:${sessionId}` );

			sendRooms( io.to( `session:${sessionId}` ) );
			sendJoinedRooms( sessionId );

			const disconnected = fromNodeEvent( socket, 'disconnect' ).pipe( share(), take( 1 ) );
			const disconnecting = fromNodeEvent( socket, 'disconnecting' ).pipe( share(), take( 1 ), takeUntil( disconnected ) );

			async function newGame( roomId: string, ruleSet: RuleSet ) {
				const rules = ruleSetMap.get( ruleSet );
				const gameId = uuid();
				const gameState = rules.getInitialState();
				const defaultColors = [ 'black', 'white', 'red', 'blue' ];

				const game: ServerGame = {
					_id: gameId,
					colors: defaultColors.slice( 0, rules.colors ),
					gameStates: [ gameState ],
					ruleSet
				};
				await collections.games.insertOne( game );
				await collections.rooms.updateOne( { _id: roomId }, { $set: { gameId } } as Partial<ServerRoom> );
				await sendRooms();
				return game;
			}

			fromNodeEvent( socket, 'createRoom' )
			.pipe(
				takeUntil( disconnecting ),
				concatMap( async ( [ { name, password }, callback ] ) => {
					try {
						if( !isValidRoomName( name ) ) throw new Error( 'Invalid room name.' );
						const roomId = uuid();
						await collections.rooms.insertOne( {
							_id: roomId,
							name,
							passwordHash: password ? await hashPassword( password ) : ''
						} as ServerRoom );
						await promisify( socket.join ).call( socket, `room:${roomId}` );
						await collections.roomSessions.insert( { roomId, sessionId, colors: [ 0 ] } as ServerRoomSession );
						const game = await newGame( roomId, RuleSet.standard );
						await sendJoinedRooms( sessionId );
						await io.to( `room:${roomId}` ).emit( 'update', s2cGame( game ) );
						callback( null, roomId );
					} catch( ex ) {
						console.error( ex );
						callback( ex, null );
					}
				} )
			)
			.subscribe();

			fromNodeEvent( socket, 'newGame' )
			.pipe(
				takeUntil( disconnecting ),
				concatMap( async ( [ { roomId, ruleSet }, callback ] ) => {
					try {
						io.to( `room:${roomId}` ).emit( 'message', { roomId, message: 'New game' } );
						callback( null, await newGame( roomId, ruleSet ) );
					} catch( ex ) {
						console.error( ex );
						callback( ex, null );
					}
				} )
			)
			.subscribe();

			fromNodeEvent( socket, 'joinRoom' )
			.pipe(
				takeUntil( disconnecting ),
				concatMap( async ( [ { roomId, password }, callback ] ) => {
					try {
						const nick = await getNick( sessionId );
						const room = await collections.rooms.findOne( { _id: roomId } );
						if( !room ) throw new Error( 'No such room.' );
						if( room.passwordHash ) {
							if( !password ) throw new Error( 'Room requires a password.' );
							if( !await checkPassword( password, room.passwordHash ) ) throw new Error( 'Incorrect password.' );
						}
						await promisify( socket.join ).call( socket, `room:${roomId}` );
						await collections.roomSessions.insert( { roomId, sessionId, colors: [] } );
						await collections.expirations.remove( { _id: roomId }, { single: true } );
						if( room.gameId ) {
							const game = await collections.games.findOne( { _id: room.gameId } );
							if( game ) {
								await io.to( `session:${sessionId}` ).emit( 'update', s2cGame( game ) );
							}
						}
						await sendJoinedRooms( sessionId );
						const message = `${nick} has joined the room.`;
						io.to( `room:${roomId}` ).emit( 'message', { roomId, message } );
						callback( null, room._id );
					} catch( ex ) {
						console.error( ex );
						callback( ex, null );
					}
				} )
			)
			.subscribe();

			fromNodeEvent( socket, 'leaveRoom' )
			.pipe(
				takeUntil( disconnecting ),
				concatMap( async ( [ { roomId }, callback ] ) => {
					try {
						const nick = await getNick( sessionId );
						await promisify( socket.leave ).call( socket, `room:${roomId}` );
						const { result } = await collections.roomSessions.remove( { sessionId, roomId }, { single: true } );
						if( result.n > 0 ) {
							const message = `${nick} has left the room.`;
							io.to( `room:${roomId}` ).emit( 'message', { roomId, message } );
						}
						await sendJoinedRooms( sessionId );
						callback( null, {} );
					} catch( ex ) {
						console.error( ex );
						callback( ex, null );
					}
				} )
			)
			.subscribe();

			fromNodeEvent( socket, 'sendMessage' )
			.pipe(
				takeUntil( disconnecting ),
				concatMap( async ( [ { roomId, message }, callback ] ) => {
					try {
						const nick = await getNick( sessionId );
						if( !await collections.roomSessions.findOne( { roomId, sessionId }, { projection: { _id: 1 } } ) ) {
							throw new Error( 'Not in room.' );
						}
						io.to( `room:${roomId}` ).emit( 'message', { roomId, user: nick, message } );
						callback( null, {} );
					} catch( ex ) {
						console.error( ex );
						callback( ex, null );
					}
				} )
			).subscribe();

			fromNodeEvent( socket, 'setNick' )
			.pipe(
				takeUntil( disconnecting ),
				concatMap( async ( [ { nick }, callback ] ) => {
					try {
						const oldNick = await getNick( sessionId );
						await collections.sessions.updateOne( { _id: sessionId }, { $set: { nick } } );
						const roomIds = ( await collections.roomSessions.find( { sessionId } ).project( { roomId: 1 } ).toArray() ).map( r => r.roomId );
						if( roomIds.length ) {
							const message = `${oldNick} is now known as ${nick}.`;
							for( const roomId of roomIds ) {
								io.to( `room:${roomId}` ).emit( 'message', { roomId, message } );
							}
						}
						callback( null, {} );
					} catch( ex ) {
						console.error( ex );
						callback( ex, null );
					}
				} )
			)
			.subscribe();

			fromNodeEvent( socket, 'makeMove' )
			.pipe(
				takeUntil( disconnecting ),
				concatMap( async ( [ { roomId, position }, callback ] ) => {
					try {
						const roomSession = await collections.roomSessions.findOne( { roomId, sessionId } );
						if( !roomSession ) throw new Error( 'Not in room.' );
						const room = await collections.rooms.findOne( { _id: roomId } );
						if( !room ) throw new Error( 'Room not found.' );
						const gameId = room.gameId;
						const game = await collections.games.findOne( { _id: gameId } );
						if( !game ) throw new Error( 'Game not found.' );
						const rules = ruleSetMap.get( game.ruleSet );
						let newGameState: ClientGameState;
						const gameStates = [ ...game.gameStates ];
						const oldGameState = s2cGameState( gameStates.slice( -1 )[ 0 ] );
						if( !roomSession.colors.includes( oldGameState.turn ) ) {
							// throw new Error( 'Wrong turn.' );
						}
						newGameState = rules.makeMove( oldGameState, position );
						if( !newGameState ) throw new Error( 'Invalid move.' );
						gameStates.push( newGameState );
						await collections.games.updateOne( { _id: gameId }, { $set: { gameStates } } );
						game.gameStates = gameStates;
						io.to( `room:${roomId}` ).emit( 'update', s2cGame( game ) );
						if( rules.isGameOver( newGameState ) ) {
							const scores =
							Array.from( { length: rules.colors } )
							.map( ( _, color ) => ( {
								color: colors[ game.colors[ color ] ].displayName,
								score: rules.getScore( newGameState, color )
							} ) );
							scores.sort( ( c1, c2 ) => {
								const r1 = rules.compareScores( c1.score, c2.score );
								return ( r1 === 0 ) ? c1.color.localeCompare( c2.color ) : r1;
							} );
							const bestScore = scores[ 0 ].score;
							const winners = scores.filter( ( { score } ) => rules.compareScores( score, bestScore ) );
							let message: string;
							if( winners.length !== 1 ) {
								message = 'Draw game';
							} else {
								message = `${winners[ 0 ].color} wins`;
							}
							io.to( `room:${roomId}` ).emit( 'message', { roomId, message: `${message}:\n${scores.map(({color, score})=>`${color}: ${score}`).join('\n')}` } );
						}
						callback( null, {} );
					} catch( ex ) {
						console.error( ex );
						callback( ex, null );
					}
				} )
			)
			.subscribe();

			disconnected.subscribe( async () => {
				try {
					const nick = await getNick( sessionId );
					const message = `${nick} has disconnected.`;
					const roomIds = ( await collections.roomSessions.find( { sessionId }, { projection: { _id: 1 } } ).toArray() ).map( r => r._id );
					for( const roomId of roomIds ) {
						io.to( `room:${roomId}` ).emit( 'message', { roomId, message } );
					}
				} catch( ex ) {
					console.error( ex );
				}

				await Promise.all( [
					await collections.sessions.remove( { sessionId }, { single: true } ),
					await collections.roomSessions.remove( { sessionId } )
				] );
				console.log( `User disconnected, ${--connections} connected` );
			} );
		} );

		interval( cleanupConfig.checkSeconds * 1000 )
		.pipe(
			takeUntil( shuttingDown ),
			exhaustMap( async () => {
				const expires = Date.now() + cleanupConfig.expireSeconds * 1000;
				const activeRoomIds = Array.from( new Set( ( await collections.roomSessions.find().project( { roomId: 1 } ).toArray() ).map( rs => rs.roomId ) ) );
				await collections.expirations.remove( { _id: { $in: activeRoomIds } } );
				const inactiveRoomIds = Array.from( new Set( ( await collections.rooms.find( { _id: { $nin: activeRoomIds } } ).project( { roomId: 1 } ).toArray() ).map( r => r._id ) ) );
				if( inactiveRoomIds.length > 0 ) {
					await collections.expirations.update(
						{ _id: { $in: inactiveRoomIds } },
						{ $setOnInsert: { expires } },
						{ upsert: true }
					);
				}
			} )
		)
		.subscribe();

		interval( cleanupConfig.checkSeconds * 1000 )
		.pipe(
			takeUntil( shuttingDown ),
			exhaustMap( async () => {
				const now = Date.now();
				const expiredIds = ( await collections.expirations.find( { expires: { $lte: now } } ).project( { _id: 1 } ).toArray() ).map( e => e._id );

				let removedRooms = 0;
				await Promise.all( [
					async () => { await collections.expirations.remove( { _id: { $in: expiredIds } } ); },
					async () => {
						const r = await collections.rooms.remove( { _id: { $in: expiredIds } } );
						removedRooms = r.result.n;
					},
					async () => { await collections.roomSessions.remove( { roomId: { $in: expiredIds } } ); }
				].map( fn => fn() ) );
				if( removedRooms > 0 ) {
					await sendRooms();
				}
			} )
		)
		.subscribe();
	} catch( ex ) {
		console.error( ex );
	}
} )();
