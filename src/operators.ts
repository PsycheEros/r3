import { Observer, pipe, of } from 'rxjs';
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

export const toMap = <U, K, L = U>( fnKey: ( e: U ) => K, fnValue: ( e : U ) => L = e => ( e as any ) ) =>
	map<ReadonlyArray<U>, Map<K, L>>( e => {
		const m = new Map<K, L>();
		for( const i of e ) {
			m.set( fnKey( i ), fnValue( i ) );
		}
		return m;
	} );

export const toArrayMap = <U, K, L = U>( fn: ( e: U ) => K, fnValue: ( e : U ) => L = e => ( e as any ) ) =>
	map<ReadonlyArray<U>, Map<K, ReadonlyArray<L>>>( e => {
		const m = new Map<K, ReadonlyArray<L>>();
		for( const i of e ) {
			const key = fn( i );
			m.set( key, [ ...( m.get( key ) || [] ), fnValue( i ) ] );
		}
		return m;
	} );

export const mapMap = <T, U>( fn: ( e: T ) => U ) =>
	map<ReadonlyArray<T>, U[]>( v => v.map( fn ) );
