import { redis as redisConfig } from 'data/config.yaml';
import Redis from 'ioredis';
import adapter from 'socket.io-redis';
import uuid from 'uuid/v4';
import { shutDown, shuttingDown } from './shut-down';
import { server } from './app';

const pub = new Redis( { ...redisConfig, db: 0, dropBufferSupport: true } );
const redis = new Redis( { ...redisConfig, db: 0 } );

shuttingDown.subscribe( async () => {
	await Promise.all( [
		pub.quit(),
		redis.quit()
	] );
} );

export const io = require( 'socket.io' )( server ) as SocketIO.Server & NodeJS.EventEmitter;

io.engine[ 'generateId' ] = uuid;

io.adapter( adapter( { pubClient: pub, subClient: redis } ) );
