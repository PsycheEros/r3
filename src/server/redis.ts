import { redis as redisConfig } from 'data/config.yaml';
import Redis from 'ioredis';
import { shuttingDown } from './shut-down';

export const pub = new Redis( { ...redisConfig, db: 1, dropBufferSupport: true } );
export const redis = new Redis( { ...redisConfig, db: 1, dropBufferSupport: true } );

shuttingDown.subscribe( async () => {
	await Promise.all( [
		pub.quit(),
		redis.quit()
	] );
} );
