import './error-handler';
import './polyfills';

import { take, takeUntil, share, exhaustMap, filter, debounceTime, map, switchMap, mergeMap, shareReplay, startWith } from 'rxjs/operators';
import { fromNodeEvent } from './rxjs';
import { promisify } from 'util';
import { isValidRoomName, isValidNick, isValidUserPassword } from 'src/validation';
import { mapMap, trackInserts, trackDeletes, mapFilter, switchMapMap, mergeMapMap, tapLog } from 'src/operators';
import { ruleSetMap } from 'src/rule-sets';
import { io, handleMessage } from './socket';
import { colors } from 'data/colors.yaml';
import { hashPassword, checkPassword } from './security';
import { Int32 } from 'bson';
import _ from 'lodash';
import { uuid, uuidStr } from './uuid';
import { s2cRoom, s2cGame, s2cSession, s2cRoomSession } from './server-to-client';
import { s2mGame } from './server-to-mongo';
import { connectMongodb } from './mongodb';
import { Binary } from 'mongodb';
import { snoozeExpiry } from './cleanup';
import { timer } from 'rxjs';
import { localBus } from './bus';
import { c2sGameState } from './client-to-server';
import { c2mGameState } from 'server/client-to-mongo';
import { clientSession$, clientRoom$, clientRoomSession$, clientSessionDelete$, clientSessionInsert$, serverSessionDelete$ } from 'server/reactive-data';

clientRoom$.pipe(
	switchMap( async data => {
		io.send( { type: 'rooms', data } );
	} )
)
.subscribe();

clientSession$.pipe(
	switchMap( async data => {
		io.send( { type: 'sessions', data } );
	} )
)
.subscribe();

clientRoomSession$.pipe(
	switchMap( async data => {
		io.send( { type: 'roomSessions', data } );
	} )
)
.subscribe();

( async () => {
	try {
		const { collections } = await connectMongodb();

		serverSessionDelete$
		.pipe(
			mergeMap( async session => {
				const { deletedCount } = await collections.roomSessions.deleteMany( { sessionId: session._id } );
				if( deletedCount > 0 ) {
					localBus.next( { type: BusMessageType.UpdateRoomSession, data: {} } );
				}
			} )
		)
		.subscribe();

		async function getNick( sessionId: Binary ) {
			const { nick } = await collections.sessions.findOne( { _id: sessionId }, { projection: { _id: 0, nick: 1 } } );
			return nick;
		}

		let connections = 0;

		fromNodeEvent<SocketIO.Socket>( io, 'connection' )
		.subscribe( async socket => {
			console.log( `User connected, ${++connections} connected, ${socket.id}` );
			const sessionId = uuid( socket.id );
			const sessionIdStr = socket.id;

			{
				const roomIds = await collections.roomSessions.find( { sessionId } ).project( { _id: 0, roomId: 1 } ).map( r => r.roomId ).toArray();
				for( const roomId of roomIds ) {
					const roomIdStr = uuidStr( roomId );
					socket.join( roomIdStr );
				}

				io.to( sessionIdStr ).send( { type: 'session', data: { sessionId: sessionIdStr } } );
				const roomSessions = await collections.roomSessions.find( {} ).map( s2cRoomSession ).toArray();
				io.to( sessionIdStr ).send( { type: 'roomSessions', data: roomSessions } );
				const rooms = await collections.rooms.find( {} ).map( s2cRoom ).toArray();
				io.to( sessionIdStr ).send( { type: 'rooms', data: rooms } );

				const gameIds = ( await collections.rooms.find( { _id: { $in: roomIds } } ).project( { _id: 0, gameId: 1 } ).toArray() ).map( r => r.gameId );
				const games = await collections.games.find( { _id: { $in: gameIds } } ).toArray();
				for( const game of games ) {
					io.to( sessionIdStr ).send( { type: 'update', data: s2cGame( game ) } );
				}
			}

			localBus.next( { type: BusMessageType.UpdateSession, data: {} } );

			const disconnected = fromNodeEvent( socket, 'disconnect' ).pipe( share(), take( 1 ) );
			const disconnecting = fromNodeEvent( socket, 'disconnecting' ).pipe( share(), take( 1 ), takeUntil( disconnected ) );

			timer( 0, 60 * 1000 )
			.pipe(
				exhaustMap( async () => {
					await snoozeExpiry( 1000 * 60 * 10, sessionId );
				} ),
				takeUntil( disconnecting )
			)
			.subscribe();

			async function newGame( roomId: Binary, ruleSet: RuleSet ) {
				const rules = ruleSetMap.get( ruleSet );
				const gameId = uuid();
				const gameState = c2sGameState( rules.getInitialState() );
				const defaultColors = [ 'black', 'white', 'red', 'blue' ];

				const game: ServerGame = {
					_id: gameId,
					colors: defaultColors.slice( 0, rules.seats ),
					gameStates: [ gameState ],
					ruleSet
				};
				await collections.games.insertOne( s2mGame( game ) );
				await collections.rooms.updateOne( { _id: roomId }, { $set: { gameId } } as Partial<ServerRoom> );
				localBus.next( { type: BusMessageType.UpdateRoom, data: {} } );
				const roomIdStr = uuidStr( roomId );
				io.to( roomIdStr ).send( { type: 'update', data: s2cGame( game ) } );
				return game;
			}

			handleMessage( socket, 'createRoom', async ( { name, password } ) => {
				if( !isValidRoomName( name ) ) throw new Error( 'Invalid room name.' );
				const roomId = uuid();
				const roomIdStr = uuidStr( roomId );
				await collections.rooms.insertOne( {
					_id: roomId,
					name,
					gameId: null,
					passwordHash: await hashPassword( password )
				} as ServerRoom );
				await promisify( socket.join ).call( socket, roomIdStr );
				await collections.roomSessions.updateOne(
					{ roomId, sessionId },
					{ $setOnInsert: { roomId, sessionId, seats: [] } },
					{ upsert: true }
				);
				const game = await newGame( roomId, RuleSet.standard );
				localBus.next( { type: BusMessageType.UpdateRoomSession, data: {} } );
				await io.to( roomIdStr ).send( { type: 'update', data: s2cGame( game ) } );
				return roomIdStr;
			} );

			handleMessage( socket, 'newGame', async ( { roomId: roomIdStr, ruleSet } ) => {
				const roomId = uuid( roomIdStr );
				io.to( roomIdStr ).send( { type: 'message', data: { roomId: roomIdStr, message: 'New game' } } );
				return s2cGame( await newGame( roomId, ruleSet ) );
			} );

			handleMessage( socket, 'joinRoom', async ( { roomId: roomIdStr, password } ) => {
				const roomId = uuid( roomIdStr );
				const nick = await getNick( sessionId );
				const room = await collections.rooms.findOne( { _id: roomId } );
				if( !room ) throw new Error( 'No such room.' );
				if( room.passwordHash ) {
					if( !password ) throw new Error( 'Room requires a password.' );
					if( !await checkPassword( password, room.passwordHash ) ) throw new Error( 'Incorrect password.' );
				}
				await promisify( socket.join ).call( socket, roomIdStr );
				await collections.roomSessions.updateOne( { roomId, sessionId }, { $setOnInsert: {
					roomId,
					sessionId,
					seats: []
				} }, { upsert: true } );
				await collections.expirations.deleteOne( { _id: roomId } );
				if( room.gameId ) {
					const game = await collections.games.findOne( { _id: room.gameId } );
					if( game ) {
						await io.to( sessionIdStr ).send( { type: 'update', data: s2cGame( game ) } );
					}
				}
				localBus.next( { type: BusMessageType.UpdateSession, data: {} } );
				localBus.next( { type: BusMessageType.UpdateRoomSession, data: {} } );
				const message = `${nick} has joined the room.`;
				io.to( roomIdStr ).send( { type: 'message', data: { roomId: roomIdStr, message } } );
				return uuidStr( room._id );
			} );

			handleMessage( socket, 'leaveRoom', async ( { roomId: roomIdStr } ) => {
				const roomId = uuid( roomIdStr );
				const nick = await getNick( sessionId );
				await promisify( socket.leave ).call( socket, roomIdStr );
				const { deletedCount } = await collections.roomSessions.deleteMany( { sessionId, roomId } );
				if( deletedCount > 0 ) {
					const message = `${nick} has left the room.`;
					io.to( roomIdStr ).send( { type: 'message', data: { roomId: roomIdStr, message } } );
				}
				localBus.next( { type: BusMessageType.UpdateSession, data: {} } );
				localBus.next( { type: BusMessageType.UpdateRoomSession, data: {} } );
			} );

			handleMessage( socket, 'sendMessage', async ( { roomId: roomIdStr, message } ) => {
				const roomId = uuid( roomIdStr );
				const nick = await getNick( sessionId );
				if( !await collections.roomSessions.findOne( { roomId, sessionId }, { projection: { _id: 1 } } ) ) {
					throw new Error( 'Not in room.' );
				}
				io.to( roomIdStr ).send( { type: 'message', data: { roomId: roomIdStr, user: nick, message } } );
			} );

			handleMessage( socket, 'sit', async ( { roomId: roomIdStr, seat } ) => {
				const roomId = uuid( roomIdStr );
				const existingSeats = await collections.roomSessions.find( { roomId: { $eq: roomId }, sessionId: { $ne: sessionId }, seats: { $elemMatch: { $eq: new Int32( seat ) } } } ).toArray();
				if( existingSeats.length > 0 ) throw new Error( 'Seat not available.' );
				const { modifiedCount } = await collections.roomSessions.updateOne( { roomId, sessionId, seat: { $not: { $elemMatch: { $eq: seat } } } }, { $addToSet: { seats: new Int32( seat ) } } );
				if( modifiedCount === 0 ) return;
				localBus.next( { type: BusMessageType.UpdateRoomSession, data: {} } );
				const { gameId } = ( await collections.rooms.findOne( { _id: roomId, gameId: { $ne: null } }, { projection: { _id: 0, gameId: 1 } } ) ) || { gameId: null };
				if( !gameId ) return;
				const game = await collections.games.findOne( { _id: gameId } );
				if( !game ) return;
				const color = colors[ game.colors[ seat ] ];
				if( !color ) return;
				const nick = await getNick( sessionId );
				const message = `${nick} is now playing as ${color.displayName}.`;
				io.to( roomIdStr ).send( { type: 'message', data: { roomId: roomIdStr, message } } );
			} );

			handleMessage( socket, 'stand', async ( { roomId: roomIdStr, seat } ) => {
				const roomId = uuid( roomIdStr );
				const { modifiedCount } = await collections.roomSessions.updateOne( { roomId, sessionId, seats: { $elemMatch: { $eq: seat } } }, { $pull: { seats: new Int32( seat ) } } );
				if( modifiedCount === 0 ) return;
				localBus.next( { type: BusMessageType.UpdateRoomSession, data: {} } );
				const { gameId } = ( await collections.rooms.findOne( { _id: roomId, gameId: { $ne: null } }, { projection: { _id: 0, gameId: 1 } } ) ) || { gameId: null };
				if( !gameId ) return;
				const game = await collections.games.findOne( { _id: gameId } );
				if( !game ) return;
				const color = colors[ game.colors[ seat ] ];
				if( !color ) return;
				const nick = await getNick( sessionId );

				const message = `${nick} has stopped playing as ${color.displayName}.`;
				io.to( roomIdStr ).send( { type: 'message', data: { roomId: roomIdStr, message } } );
			} );

			handleMessage( socket, 'setNick', async ( { nick } ) => {
				const oldNick = await getNick( sessionId );
				await collections.sessions.updateOne( { _id: sessionId }, { $set: { nick } } );
				const roomIds = await collections.roomSessions.find( { sessionId } ).project( { roomId: 1 } ).map( r => r.roomId ).toArray();
				localBus.next( { type: BusMessageType.UpdateSession, data: {} } );
				if( roomIds.length ) {
					const message = `${oldNick} is now known as ${nick}.`;
					for( const roomId of roomIds ) {
						const roomIdStr = uuidStr( roomId );
						io.to( roomIdStr ).send( { type: 'message', data: { roomId: roomIdStr, message } } );
					}
				}
			} );

			handleMessage( socket, 'nickAvailable', async ( { nick } ) => {
				const count = await collections.users.countDocuments( { nick } );
				return count === 0;
			} );

			handleMessage( socket, 'newUser', async ( { nick, password } ) => {
				if( !isValidNick( nick ) ) throw new Error( 'Invalid nick.' );
				if( !isValidUserPassword( password ) ) throw new Error( 'Invalid password.' );
				const userId = uuid();
				const { result } = await collections.users.updateOne( { nick }, {
					$setOnInsert: {
						_id: userId,
						nick,
						passwordHash: await hashPassword( password ),
						roles: []
					}
				}, { upsert: true } );
				await collections.sessions.updateMany( {
					nick,
					userId: { $ne: userId }
				}, {
					$set: { nick: 'Guest' }
				} );
				localBus.next( { type: BusMessageType.UpdateSession, data: {} } );
				return uuidStr( userId );
			} );

			handleMessage( socket, 'logIn', async ( { nick, password } ) => {
				const user = await collections.users.findOne( { nick }, { projection: { _id: 1, nick: 1, passwordHash: 1 } } );
				if( !checkPassword( password, user ? user.passwordHash : null ) || !user ) throw new Error( 'Invalid nick or password.' );
				await collections.sessions.updateOne( { _id: sessionId }, { $set: {
					userId: user._id,
					nick: user.nick
				} } );
				localBus.next( { type: BusMessageType.UpdateSession, data: {} } );
				return uuidStr( user._id );
			} );

			handleMessage( socket, 'logOut', async () => {
				await collections.sessions.deleteOne( { _id: sessionId } );
				await collections.roomSessions.deleteMany( { sessionId } );
				localBus.next( { type: BusMessageType.UpdateSession, data: {} } );
				localBus.next( { type: BusMessageType.UpdateRoomSession, data: {} } );
				socket.disconnect();
			} );

			handleMessage( socket, 'makeMove', async ( { roomId: roomIdStr, position } ) => {
				const roomId = uuid( roomIdStr );
				const roomSession = await collections.roomSessions.findOne( { roomId, sessionId } );
				if( !roomSession ) throw new Error( 'Not in room.' );
				const room = await collections.rooms.findOne( { _id: roomId } );
				if( !room ) throw new Error( 'Room not found.' );
				const gameId = room.gameId;
				const serverGame = await collections.games.findOne( { _id: gameId } );
				if( !serverGame ) throw new Error( 'Game not found.' );
				const game = s2cGame( serverGame );
				const rules = ruleSetMap.get( game.ruleSet );
				const gameStates = [ ...game.gameStates ];
				const oldGameState = gameStates.slice( -1 )[ 0 ];
				const seat = oldGameState.turn;
				if( !rules.isValid( oldGameState, position, seat ) ) throw new Error( 'Invalid move.' );
				if( !roomSession.seats.includes( seat ) ) {
					let fail = true;
					if( ( await collections.roomSessions.countDocuments( { roomId: { $eq: roomId }, sessionId: { $ne: sessionId }, seats: { $elemMatch: { $eq: new Int32( seat ) } } } ) ) === 0 ) {
						const { modifiedCount } = await collections.roomSessions.updateOne( { roomId, sessionId, seats: { $not: { $elemMatch: { $eq: new Int32( seat ) } } } }, { $addToSet: { seats: new Int32( seat ) } } );
						if( modifiedCount > 0 ) fail = false;
					}
					if( fail ) throw new Error( 'Wrong turn.' );
					localBus.next( { type: BusMessageType.UpdateRoomSession, data: {} } );
					const colorData = colors[ game.colors[ seat ] ];
					const nick = await getNick( sessionId );
					const message = `${nick} is now playing as ${colorData.displayName}.`;
					io.to( roomIdStr ).send( { type: 'message', data: { roomId: roomIdStr, message } } );
				}
				const newGameState = rules.makeMove( oldGameState, position );
				if( !newGameState ) throw new Error( 'Invalid move.' );
				await collections.games.updateOne( { _id: gameId }, {
					$push: { gameStates: c2mGameState( newGameState ) }
				} );
				game.gameStates = [ ...gameStates, newGameState ];
				io.to( roomIdStr ).send( { type: 'update', data: game } );
				if( rules.isGameOver( newGameState ) ) {
					const scores =
					Array.from( { length: rules.seats } )
					.map( ( _, seat ) => ( {
						color: colors[ game.colors[ seat ] ].displayName,
						score: rules.getScore( newGameState, seat )
					} ) );
					scores.sort( ( c1, c2 ) => {
						const r1 = rules.compareScores( c1.score, c2.score );
						return ( r1 === 0 ) ? c1.color.localeCompare( c2.color ) : r1;
					} );
					const bestScore = scores[ 0 ].score;
					const winners = scores.filter( ( { score } ) => rules.compareScores( score, bestScore ) === 0 );
					let message: string;
					if( winners.length !== 1 ) {
						message = 'Draw game';
					} else {
						message = `${winners[ 0 ].color} wins`;
					}
					io.to( roomIdStr ).send( { type: 'message', data: { roomId: roomIdStr, message: `${message}:\n${scores.map(({color, score})=>`${color}: ${score}`).join('\n')}` } } );
				}
			} );

			disconnected.subscribe( async () => {
				const nick = await getNick( sessionId );
				const message = `${nick} has disconnected.`;
				const roomIds = await collections.roomSessions.find( { query: { sessionId } } ).map( r => uuidStr( r.roomId ) ).toArray();
				for( const roomId of roomIds ) {
					io.to( roomId ).send( { type: 'message', data: { roomId, message } } );
				}
			} );

			disconnected.subscribe( async () => {
				console.log( `User disconnected, ${--connections} connected` );
			} );
		} );
	} catch( ex ) {
		console.error( ex );
	}
} )();
