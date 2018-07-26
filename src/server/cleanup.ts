import { interval } from 'rxjs';
import { takeUntil, exhaustMap } from 'rxjs/operators';
import { checkSeconds, expireSeconds } from 'data/cleanup.config.yaml';
import { shuttingDown } from './shut-down';
import { connectMongodb } from './mongodb';

export async function clearExpiry( ...ids: string[] ) {
	const { collections } = await connectMongodb();
	await collections.expirations.remove(
		{ _id: { $in: ids } }
	);
}

export async function snoozeExpiry( millis: number, ...ids: string[] ) {
	const expires = Date.now() + millis;
	const { collections } = await connectMongodb();
	await collections.expirations.update(
		{ _id: { $in: ids }, expires: { $lt: expires } },
		{ $set: { expires } },
		{ upsert: true }
	);
}

interval( checkSeconds * 1000 )
.pipe(
	takeUntil( shuttingDown ),
	exhaustMap( async () => {
		const { collections } = await connectMongodb();
		const expires = Date.now() + expireSeconds * 1000;
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

interval( checkSeconds * 1000 )
.pipe(
	takeUntil( shuttingDown ),
	exhaustMap( async () => {
		const { collections } = await connectMongodb();
		const now = Date.now();
		const expiredIds = ( await collections.expirations.find( { expires: { $lte: now } } ).project( { _id: 1 } ).toArray() ).map( e => e._id );

		const removed = {
			rooms: 0,
			roomSessions: 0,
			sessions: 0
		};
		await Promise.all( [
			async () => { await collections.expirations.remove( { _id: { $in: expiredIds } } ); },
			async () => {
				removed.rooms = (
					await collections.rooms.remove( { _id: { $in: expiredIds } } )
				).result.n;
			},
			async () => {
				removed.sessions = (
					await collections.sessions.remove( { _id: { $in: expiredIds } } )
				).result.n;
			},
			async () => {
				removed.roomSessions = (
					await collections.roomSessions.remove( {
						$or: [
							{ roomId: { $in: expiredIds } },
							{ sessionId: { $in: expiredIds } }
						]
					} )
				).result.n;
			}
		].map( fn => fn() ) );
	} )
)
.subscribe();