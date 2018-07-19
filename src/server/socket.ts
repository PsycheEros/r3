import { redis as redisSettings } from 'data/config.yaml';
import Redis from 'ioredis';
import adapter from 'socket.io-redis';
import uuid from 'uuid/v4';
import { shuttingDown } from './shut-down';
import { server } from './app';

const pub = new Redis( redisSettings.url, { ...redisSettings.config, db: 0, dropBufferSupport: true } );
const redis = new Redis( redisSettings.url, { ...redisSettings.config, db: 0 } );

shuttingDown.subscribe( async () => {
	await Promise.all( [
		pub.quit(),
		redis.quit()
	] );
} );

export const io = require( 'socket.io' )( server ) as SocketIO.Server & NodeJS.EventEmitter;

io.engine[ 'generateId' ] = uuid;

io.adapter( adapter( { pubClient: pub, subClient: redis } ) );
