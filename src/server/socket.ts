import { pubSub } from './redis';
import adapter from 'socket.io-redis';
import { uuid, uuidStr } from './uuid';
import { onShutDown, shuttingDown } from './shut-down';
import { server } from './app';
import { promisify } from 'util';
import { fromNodeEvent } from 'server/rxjs';
import { filter, takeUntil, mergeMap, share } from 'rxjs/operators';
import { EventEmitter } from 'events';
import Io, { ServerOptions } from 'socket.io';
import { connectMongodb } from './mongodb';
import { Observable } from 'rxjs';

export const io = Io( server, {
	transports: [ 'websocket' ],
	cookie: false
} as ServerOptions ) as SocketIO.Server & NodeJS.EventEmitter;
onShutDown( async () => {
	try {
		await promisify( io.close ).call( io );
	} catch {}
} );

io.use( ( socket, cb ) => {
	const token = uuid( socket.handshake.query.token as string );
	( async () => {
		try {
			let sessionId = uuid();
			const { collections } = await connectMongodb();
			const { value } = await collections.sessions.findOneAndUpdate(
				{ token },
				{ $setOnInsert: { _id: sessionId, nick: 'Guest', token, userId: null } },
				{ upsert: true }
			);
			if( value ) {
				sessionId = value._id;
			}
			socket.id = uuidStr( sessionId );
		} catch( ex ) {
			console.error( ex );
			throw ex;
		}
	} )().then( () => { cb(); }, cb );
} );

const { pub: pubClient, sub: subClient } = pubSub( { db: 0, dropBufferSupport: true }, { db: 0 } );
io.adapter( adapter( { pubClient, subClient } ) );

type EventTarget = Pick<NodeJS.EventEmitter|EventEmitter, 'addListener'|'removeListener'>;

type Message<T> = { type: string, data: T };
type MessageEventArgs<T> = [ Message<T>, Function ];
const messageHandlers = new WeakMap<EventTarget, Observable<MessageEventArgs<any>>>();

export function handleMessage<T>( target: EventTarget, type: string, handler: ( data: T ) => Promise<any>|void ) {
	let messages: Observable<MessageEventArgs<T>> = messageHandlers.get( target );
	if( !messages ) {
		messages =
			fromNodeEvent<MessageEventArgs<T>>( target, 'message' )
			.pipe(
				takeUntil( shuttingDown ),
				share()
			);
		messageHandlers.set( target, messages );
	}

	messages
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
