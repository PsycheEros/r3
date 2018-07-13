import { Observer } from 'rxjs';
import { tap } from 'rxjs/operators';

export const tapLog = <T>( ...prefixes: string[] ) =>
	tap(
		[ 'next', 'error', 'complete' ]
		.reduce( ( prev, key ) => ( { ...prev, [ key ]: console.log.bind( console, ...prefixes, key ) } ), {} as Observer<T> )
	);
