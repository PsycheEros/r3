import { Observable, Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import Rules from '../rules';
import Game from '../game';
import GameState from '../game-state';
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
		const { webSocket } = this;
		let retval = webSocket.share().filter( m => m.name !== 'ack' );
		if( messageNames.length ) {
			retval = retval.filter( m => messageNames.includes( m.name ) );
		}
		return retval;
	}

	public getEvents<T>( message: string ) {
		return this.getMessages<T>( message ).map( m => m.data );
	}

	public send<T>( name: string, data: Object = {} ) {
		return new Promise<T>( ( resolve, reject ) => {
			const messageId = uuid(),
				subscription =
					this.webSocket
					.share()
					.filter( m => m.name === 'ack' && m.messageId === messageId )
					.take( 1 )
					.subscribe( ( { data: [ error, data ] } ) => {
						if( error ) {
							reject( new Error( error ) );
						} else {
							resolve( data );
						}
						subscription.unsubscribe();
					} );

			setTimeout( () => {
				reject( new Error( 'Timeout' ) );
				subscription.unsubscribe();
			}, timeout );
			const { webSocket } = this;
			try {
				webSocket.next( <any>JSON.stringify( { messageId, name, data } ) );
			} catch( ex ) {
				reject( ex );
			}
		} );
	}

	private webSocket: Subject<SocketMessage<any>>;
	private readonly openSubject = new Subject<Event>();
	private readonly closeSubject = new Subject<CloseEvent>();
	private readonly closingSubject = new Subject<void>();
}
