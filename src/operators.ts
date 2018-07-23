import { Observer, pipe, of, merge } from 'rxjs';
import { distinctUntilChanged, filter, groupBy, map, pairwise, startWith, tap, toArray, switchMap, mergeMap } from 'rxjs/operators';
import { without } from 'lodash';

export const tapLog = <T>( ...prefixes: any[] ) =>
	tap(
		[ 'next', 'error', 'complete' ]
		.reduce( ( prev, key ) => ( { ...prev, [ key ]: console.log.bind( console, ...prefixes, key ) } ), {} as Observer<T> )
	);

export const trackChanges = <T>() =>
	pipe(
		startWith<T>( null ),
		distinctUntilChanged<T>(),
		pairwise<T>()
	);

export const trackInserts = <T extends ReadonlyArray<any>>() =>
	pipe(
		trackChanges<T>(),
		map<[ T, T ], T>( ( [ before, after ] ) => without( after, ...( before || [] ) ) as any ),
		filter( _ => _.length > 0 )
	);

export const trackDeletes = <T extends ReadonlyArray<any>>() =>
	pipe(
		trackChanges<T>(),
		map<[ T, T ], T>( ( [ before, after ] ) => without( before, ...( after || [] ) ) as any ),
		filter( _ => _.length > 0 )
	);

export const joinLeft = <T, U>() =>
	pipe(
		switchMap<[ T, U ][], [ T, U[] ][]>( rs =>
			of( rs )
			.pipe(
				mergeMap( _ => _ ),
				groupBy( ( [ left ] ) => left ),
				switchMap( async g => (	[
					g.key,
					await g.pipe(
						map( ( [ , right ] ) => right ),
						toArray()
					).toPromise()
				] as [ T, U[] ] ) ),
				toArray()
			)
		)
	);
