import { interval } from 'rxjs';
import { takeUntil, exhaustMap } from 'rxjs/operators';
import { checkSeconds, expireSeconds } from 'data/cleanup.config.yaml';
import { shuttingDown } from './shut-down';
import { connectMongodb } from './mongodb';
import { localBus } from './bus';
import { Binary } from 'mongodb';

export async function clearExpiry( ...ids: Binary[] ) {
	const { collections } = await connectMongodb();
	await collections.expirations.deleteMany(
		{ _id: { $in: ids } }
	);
}

export async function setExpiry( millis: number, ...ids: Binary[] ) {
	const expires = new Date( Date.now() + millis );
	const { collections } = await connectMongodb();
	await Promise.all( ids.map( _id =>
		collections.expirations.updateOne(
			{ _id },
			{ $setOnInsert: { _id }, $set: { expires} },
			{ upsert: true }
		)
	) );
}

export async function snoozeExpiry( millis: number, ...ids: Binary[] ) {
	const expires = new Date( Date.now() + millis );
	const { collections } = await connectMongodb();
	await Promise.all( ids.map( _id =>
		collections.expirations.updateOne(
			{ _id, expires: { $lt: expires } },
			{ $setOnInsert: { _id }, $set: { expires } },
			{ upsert: true }
		)
	) );
}

interval( checkSeconds * 1000 )
.pipe(
	takeUntil( shuttingDown ),
	exhaustMap( async () => {
		const { collections } = await connectMongodb();
		const expires = new Date( Date.now() + expireSeconds * 1000 );
		const activeRoomIds = Array.from( new Set( await collections.roomSessions.find().project( { roomId: 1 } ).map( rs => rs.roomId ).toArray() ) );
		await collections.expirations.deleteMany( { _id: { $in: activeRoomIds } } );
		const inactiveRoomIds = Array.from( new Set( await collections.rooms.find( { _id: { $nin: activeRoomIds } } ).project( { roomId: 1 } ).map( r => r._id ).toArray() ) );
		await Promise.all( inactiveRoomIds.map( _id =>
			collections.expirations.updateMany(
				{ _id },
				{ $setOnInsert: { _id, expires } },
				{ upsert: true, arrayFilters: undefined }
			)
		) );
	} )
)
.subscribe();

interval( checkSeconds * 1000 )
.pipe(
	takeUntil( shuttingDown ),
	exhaustMap( async () => {
		const { collections } = await connectMongodb();
		const now = new Date;
		const expiredIds = await collections.expirations.find( { expires: { $lte: now } } ).project( { _id: 1 } ).map( e => e._id ).toArray();
		if( expiredIds.length === 0 ) return;

		const removed = {
			rooms: 0,
			roomSessions: 0,
			sessions: 0
		};
		await Promise.all( [
			async () => { await collections.expirations.deleteMany( { _id: { $in: expiredIds } } ); },
			async () => {
				removed.rooms = (
					await collections.rooms.deleteMany( { _id: { $in: expiredIds } } )
				).deletedCount;
			},
			async () => {
				removed.sessions = (
					await collections.sessions.deleteMany( { _id: { $in: expiredIds } } )
				).deletedCount;
			},
			async () => {
				removed.roomSessions = (
					await collections.roomSessions.deleteMany( {
						$or: [
							{ roomId: { $in: expiredIds } },
							{ sessionId: { $in: expiredIds } }
						]
					} )
				).deletedCount;
			}
		].map( fn => fn() ) );
		if( removed.rooms > 0 ) {
			localBus.next( { type: BusMessageType.UpdateRoom, data: {} } );
		}
		if( removed.sessions > 0 ) {
			localBus.next( { type: BusMessageType.UpdateSession, data: {} } );
		}
		if( removed.roomSessions > 0 ) {
			localBus.next( { type: BusMessageType.UpdateRoomSession, data: {} } );
		}
	} )
)
.subscribe();
