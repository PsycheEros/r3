import { redis as redisSettings } from 'data/config.yaml';
import Redis from 'ioredis';

let url = redisSettings.url;
if( process.env.REDIS_URL ) url = process.env.REDIS_URL;

export function redis( options: Partial<Redis.RedisOptions> ) {
	return new Redis( url, { ...redisSettings.config, ...options } );
}
