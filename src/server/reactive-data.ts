import { localBus } from './bus';
import { mapMap, trackInserts, trackDeletes } from 'src/operators';
import { filter, startWith, debounceTime, switchMap, shareReplay, mergeMap, takeUntil } from 'rxjs/operators';
import { s2cRoom, s2cSession, s2cRoomSession } from './server-to-client';
import { ReplaySubject } from 'rxjs';
import { connectMongodb } from './mongodb';
import { shuttingDown } from 'server/shut-down';

export const serverRoom$ = new ReplaySubject<ReadonlyArray<ServerRoom>>( 1 );
export const serverSession$ = new ReplaySubject<ReadonlyArray<ServerSession>>( 1 );
export const serverSessionInsert$ =
	serverSession$.pipe(
		trackInserts( s => s._id.value ),
		mergeMap( s => s )
	);
export const serverSessionDelete$ =
	serverSession$.pipe(
		trackDeletes( s => s._id.value ),
		mergeMap( s => s )
	);
export const serverRoomSession$ = new ReplaySubject<ReadonlyArray<ServerRoomSession>>( 1 );
export const clientRoom$ = serverRoom$.pipe( mapMap( s2cRoom ) );
export const clientSession$ = serverSession$.pipe( mapMap( s2cSession ) );
export const clientSessionInsert$ =
	clientSession$.pipe(
		trackInserts( s => s.id ),
		mergeMap( s => s )
	);
export const clientSessionDelete$ =
	clientSession$.pipe(
		trackDeletes( s => s.id ),
		mergeMap( s => s )
	);
export const clientRoomSession$ = serverRoomSession$.pipe( mapMap( s2cRoomSession ) );

( async () => {
	const { collections } = await connectMongodb();

	localBus.pipe(
		filter( m => m.type === BusMessageType.UpdateRoom ),
		startWith( { type: BusMessageType.UpdateRoom, data: {} } ),
		debounceTime( 10 ),
		switchMap( () => collections.rooms.find( {} ).toArray() ),
		shareReplay( 1 ),
		takeUntil( shuttingDown )
	).subscribe( serverRoom$ );

	localBus.pipe(
		filter( m => m.type === BusMessageType.UpdateSession ),
		startWith( { type: BusMessageType.UpdateSession, data: {} } ),
		debounceTime( 10 ),
		switchMap( () => collections.sessions.find( {} ).toArray() ),
		shareReplay( 1 ),
		takeUntil( shuttingDown )
	).subscribe( serverSession$ );

	localBus.pipe(
		filter( m => m.type === BusMessageType.UpdateRoomSession ),
		startWith( { type: BusMessageType.UpdateRoomSession, data: {} } ),
		debounceTime( 10 ),
		switchMap( () => collections.roomSessions.find( {} ).toArray() ),
		shareReplay( 1 ),
		takeUntil( shuttingDown )
	).subscribe( serverRoomSession$ );
} )();
