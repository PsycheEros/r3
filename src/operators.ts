import { Observer, pipe, of, from } from 'rxjs';
import { distinctUntilChanged, filter, groupBy, map, pairwise, startWith, tap, toArray, switchMap, mergeMap, scan } from 'rxjs/operators';
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

export const trackInserts = <T, K>( fnKey: ( e: T ) => K ) =>
	pipe(
		trackChanges<ReadonlyArray<T>>(),
		map<[ ReadonlyArray<T>, ReadonlyArray<T> ], ReadonlyArray<T>>( ( [ oldValues, newValues ] ) => {
			if( !oldValues ) oldValues = [] as any;
			if( !newValues ) newValues = [] as any;
			const oldKeys = oldValues.map( ( v, i ) => fnKey( v ) );
			const newKeys = newValues.map( ( v, i ) => [ fnKey( v ), i ] as [ K, number ] );
			return newKeys.filter( ( [ k ] ) => !oldKeys.includes( k ) ).map( ( [ , i ] ) => newValues[ i ] );
		} ),
		filter( _ => _.length > 0 )
	);

export const trackDeletes = <T, K>( fnKey: ( e: T ) => K ) =>
	pipe(
		trackChanges<ReadonlyArray<T>>(),
		map<[ ReadonlyArray<T>, ReadonlyArray<T> ], ReadonlyArray<T>>( ( [ oldValues, newValues ] ) => {
			if( !oldValues ) oldValues = [];
			if( !newValues ) newValues = [];
			const oldKeys = oldValues.map( ( v, i ) => [ fnKey( v ), i ] as [ K, number ] );
			const newKeys = newValues.map( ( v, i ) => fnKey( v ) );
			return oldKeys.filter( ( [ k ] ) => !newKeys.includes( k ) ).map( ( [ , i ] ) => oldValues[ i ] );
		} ),
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

export const mergeMapMap = <T, U>( fn: ( e: T ) => U ) =>
	mergeMap<ReadonlyArray<T>, U>( v => from( v.map( fn ) ) );

export const switchMapMap = <T, U>( fn: ( e: T ) => U ) =>
	switchMap<ReadonlyArray<T>, U>( v => from( v.map( fn ) ) );

export const mapFilter = <T>( fn: ( e: T ) => boolean ) =>
	map<ReadonlyArray<T>, T[]>( v => v.filter( fn ) );

export const mapGet = <K, T>( key: K ) =>
	map<Map<K, T>, T>( v => v.get( key ) );
