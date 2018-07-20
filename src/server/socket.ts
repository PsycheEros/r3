import { redis } from './redis';
import adapter from 'socket.io-redis';
import uuid from 'uuid/v4';
import { shuttingDown } from './shut-down';
import { server } from './app';
import { promisify } from 'util';

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
