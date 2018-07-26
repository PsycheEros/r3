declare module 'data/app.config.yaml' {
	export const appSettings: JsonObject;
	export const cspPolicy: JsonObject;
}

declare module 'data/cleanup.config.yaml' {
	export const checkSeconds: number;
	export const expireSeconds: number;
}

declare module 'data/cluster.config.yaml' {
	export const workers: number;
}

declare module 'data/redis.config.yaml' {
	import { RedisOptions } from 'ioredis';
	export const url: string;
	export const options: Partial<RedisOptions>
}

declare module 'data/mongodb.config.yaml' {
	import { MongoClientOptions, MongoClientCommonOption } from 'mongodb';
	export const url: string;
	export const clientOptions: Partial<MongoClientOptions>;
	export const dbOptions: Partial<MongoClientCommonOption>;
}

declare module 'data/server.schema.yaml' {
	export const expiration: JsonObject;
	export const game: JsonObject;
	export const room: JsonObject;
	export const roomSession: JsonObject;
	export const session: JsonObject;
	export const user: JsonObject;
}
