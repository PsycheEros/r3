import { url, options } from 'data/redis.config.yaml';
import Redis from 'ioredis';
import { shuttingDown } from './shut-down';

export function redis( opts: Partial<Redis.RedisOptions> ) {
	const redis = new Redis( process.env.REDIS_URL || url, { ...options, ...opts } );
	shuttingDown.subscribe( async () => {
		await redis.quit();
	} );
	return redis;
}

export function pubSub(
	pubOpts: Partial<Redis.RedisOptions>,
	subOpts = pubOpts
) {
	const pub = redis( pubOpts );
	const sub = redis( subOpts );
	return { pub, sub };
}
