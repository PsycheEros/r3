import { redis } from './redis';
import adapter from 'socket.io-redis';
import uuid from 'uuid/v4';
import { shuttingDown } from './shut-down';
import { server } from './app';
import { promisify } from 'util';
import { fromNodeEvent } from 'server/rxjs';
import { filter, takeUntil, mergeMap } from 'rxjs/operators';
import { EventEmitter } from 'events';

const pubClient = redis( { db: 0, dropBufferSupport: true } );
const subClient = redis( { db: 0 } );
export const io = require( 'socket.io' )( server ) as SocketIO.Server & NodeJS.EventEmitter;

shuttingDown.subscribe( async () => {
	await promisify( io.close ).call( io );
	await Promise.all( [
		pubClient.quit(),
		subClient.quit()
	] );
} );

io.engine[ 'generateId' ] = uuid;

io.adapter( adapter( { pubClient, subClient } ) );

type EventTarget = Pick<NodeJS.EventEmitter|EventEmitter, 'addListener'|'removeListener'>;

export function handleMessage<T>( target: EventTarget, type: string, handler: ( data: T ) => Promise<any>|void ) {
	fromNodeEvent<[ { type: string, data: T }, Function ]>( target, 'message' )
	.pipe(
		takeUntil( shuttingDown ),
		filter( ( [ m ] ) => m.type === type ),
		mergeMap( async ( [ m, callback ] ) => {
			try {
				callback( null, await handler( m.data ) || {} );
			} catch( ex ) {
				console.error( ex );
				callback( ex || {}, null );
			}
		} )
	)
	.subscribe();
}
