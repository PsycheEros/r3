import { url, options } from 'data/redis.config.yaml';
import Redis from 'ioredis';

export function redis( options: Partial<Redis.RedisOptions> ) {
	return new Redis( process.env.REDIS_URL || url, { ...options, ...options } );
}
