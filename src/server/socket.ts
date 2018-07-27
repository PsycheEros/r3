import { pubSub } from './redis';
import adapter from 'socket.io-redis';
import uuid from 'uuid/v4';
import { onShutDown, shuttingDown } from './shut-down';
import { server } from './app';
import { promisify } from 'util';
import { fromNodeEvent } from 'server/rxjs';
import { filter, takeUntil, mergeMap } from 'rxjs/operators';
import { EventEmitter } from 'events';
import { IncomingMessage } from 'http';
import Io, { Handshake, ServerOptions } from 'socket.io';
import { connectMongodb } from './mongodb';

export const io = Io( server, {
	transports: [ 'websocket' ],
	cookie: false
} as ServerOptions ) as SocketIO.Server & NodeJS.EventEmitter;
onShutDown( () => promisify( io.close ).call( io ) );

io.use( ( socket, cb ) => {
	const token = socket.handshake.query.token as string;
	( async () => {
		try {
			const { collections } = await connectMongodb();
			const { value } = await collections.sessions.findOneAndUpdate(
				{ token },
				{ $setOnInsert: { _id: socket.id, nick: 'Guest', token } },
				{ upsert: true }
			);
			socket.id = value._id;
		} catch( ex ) {
			console.error( ex );
			throw ex;
		}
	} )().then( () => { cb(); }, cb );
} );

io.engine[ 'generateId' ] = uuid;

const { pub: pubClient, sub: subClient } = pubSub( { db: 0, dropBufferSupport: true }, { db: 0 } );
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
