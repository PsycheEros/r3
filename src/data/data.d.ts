
declare module 'data/*.yaml';

declare module 'data/config.yaml' {
	import { ConnectionOptions } from 'typeorm';
	export const workers: number;
	export const cspPolicy: object;
	export const connectionOptions: ConnectionOptions;
}
