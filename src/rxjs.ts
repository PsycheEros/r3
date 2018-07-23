import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export const outerJoin = <T, U, K>( left: Observable<ReadonlyArray<T>>, right: Observable<ReadonlyArray<U>>, keyLeft: ( e: T ) => K, keyRight: ( e: U ) => K ) =>
	combineLatest( left, right ).pipe(
		map(
			( [ left, right ] ) => {
				if( !left ) return [];
				if( !right ) right = [];
				const idMap = new Map<K, U>();
				for( const r of right ) idMap.set( keyRight( r ), r );
				return left.map( l => ( [ l, idMap.get( keyLeft( l ) ) ] as [ T, U|undefined ] ) );
			}
		)
	);

export const innerJoin = <T, U, K>( left: Observable<ReadonlyArray<T>>, right: Observable<ReadonlyArray<U>>, keyLeft: ( e: T ) => K, keyRight: ( e: U ) => K ) =>
	outerJoin<T, U, K>( left, right, keyLeft, keyRight )
	.pipe(
		map( lr => lr.filter( ( [ , r ] ) => r != null ) )
	);
