import * as mongodb from 'mongodb';

declare module 'mongodb' {
	export interface Int32 {};
	export function Int32( n: number ): Int32;
}
