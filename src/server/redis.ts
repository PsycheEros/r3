import { redis as redisSettings } from 'data/config.yaml';
import Redis from 'ioredis';
import { shuttingDown } from './shut-down';

export const pub = new Redis( redisSettings.url, { ...redisSettings.config, db: 1, dropBufferSupport: true } );
export const redis = new Redis( redisSettings.url, { ...redisSettings.config, db: 1, dropBufferSupport: true } );

shuttingDown.subscribe( async () => {
	await Promise.all( [
		pub.quit(),
		redis.quit()
	] );
} );
