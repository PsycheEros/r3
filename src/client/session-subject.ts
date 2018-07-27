import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

export class SessionSubject<T> extends BehaviorSubject<T> {
	constructor( sessionKey: string, defaultValue: T ) {
		super( defaultValue );

		try {
			const oldValue = sessionStorage.getItem( sessionKey );
			if( oldValue != null ) this.next( JSON.parse( oldValue ) );
		} catch {}

		this
		.pipe(
			startWith( this.value ),
			distinctUntilChanged(),
			debounceTime( 10 ),
			map( v => JSON.stringify( v ) )
		)
		.subscribe( value => {
			sessionStorage.setItem( sessionKey, value );
		} );
	}
}
