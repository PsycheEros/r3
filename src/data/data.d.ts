
declare module 'data/*.yaml';

declare module 'data/colors.yaml' {
	export const colors: { [ name: string ]: {
		displayName: string;
		color: [ number, number, number ];
	} };
}

declare module 'data/enums.yaml' {
	export const ruleSets: string[];
}

declare module 'data/config.yaml' {
	import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
	import { RedisOptions } from 'ioredis';
	export const workers: number;
	export const cspPolicy: object;
	export const connectionOptions: PickPartial<SqliteConnectionOptions, 'database'|'type'>;
	export const validation: {
		maxNickLength: number;
		maxRoomNameLength: number;
	};
	export const appSettings: object;
	export const cleanup: {
		rooms: {
			checkSeconds: number;
			expireSeconds: number;
		}
	};
	export const redis: Partial<RedisOptions>;
}
