import { Observable, Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

const timeout = 60000;

@Injectable()
export class SocketService {
	constructor() {
		const sessionId = uuid(),
			protocol = location.protocol.replace( /^http/i, 'ws' ),
			url = `${protocol}//${location.host}/ws/${sessionId}`;
		this.webSocket =
			Observable.webSocket( {
				url,
				openObserver: this.openSubject,
				closingObserver: this.closingSubject,
				closeObserver: this.closeSubject
			} );
		this.webSocket
			.share()
			.subscribe( m => {
				if( [ 'ack', 'error' ].includes( m.name ) ) {
					this.responseSubject.next( m as SocketMessageResponse<any> );
				} else {
					this.requestSubject.next( m as SocketMessageRequest<any> );
				}
			} );
	}

	private retryWhen( errors ) {
		return errors.mergeMap( () => {
			if( navigator.onLine ) {
				return Observable.timer( 1000 );
			} else {
				return Observable.fromEvent( window, 'online' ).take( 1 );
			}
		} );
	}

	public getMessages<T>( ...messageNames: string[] ) {
		const { requestSubject } = this;
		let retval = requestSubject.share();
		if( messageNames.length ) {
			retval = retval.filter( m => messageNames.includes( m.name ) );
		}
		return retval;
	}

	public getEvents<T>( message: string ) {
		return this.getMessages<T>( message ).map( m => m.data );
	}

	public send<T>( message: SocketMessageRequestInRsvp<any> ): Promise<SocketMessageResponseResolved<T>>;
	public send( message: SocketMessageRequestIn<any> ): Promise<void>;
	public send<T>( message: SocketMessageRequestIn<any>|SocketMessageRequestInRsvp<any> ) {
		const { messageId = uuid(), name, data, rsvp } = message;

		return new Promise<any>( ( resolve, reject ) => {
			if( rsvp ) {
				const subscription =
					this.responseSubject
						.share()
						.filter( m => m.messageId === messageId )
						.subscribe( m => {
							if( m.name === 'error' ) {
								reject( new Error( m.error ) );
							} else if( m.name === 'ack' ) {
								resolve( m );
							}
							subscription.unsubscribe();
						} );
				setTimeout( () => {
					reject( new Error( `Timeout expired for ${messageId}.` ) );
					subscription.unsubscribe();
				}, timeout );
			}
			const { webSocket } = this;
			try {
				webSocket.next( <any>JSON.stringify( { messageId, name, data } ) );
			} catch( ex ) {
				reject( ex );
			}
			if( !rsvp ) {
				resolve();
			}
		} );
	}

	private readonly webSocket: Subject<SocketMessage<any>>;
	private readonly requestSubject = new Subject<SocketMessageRequest<any>>();
	private readonly responseSubject = new Subject<SocketMessageResponse<any>>();
	private readonly openSubject = new Subject<Event>();
	private readonly closeSubject = new Subject<CloseEvent>();
	private readonly closingSubject = new Subject<void>();
}
