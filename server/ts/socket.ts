import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/share';
import { v4 as uuid } from 'uuid';

const timeout = 60000;

export class Socket {
	private readonly requestSubject = new Subject<SocketMessageRequest<any>>();
	private readonly responseSubject = new Subject<SocketMessageResponse<any>>();
	private readonly connectedSubject = new Subject<boolean>();

	public constructor( private readonly ws: Express.WebSocket ) {
		const { requestSubject, responseSubject, connectedSubject } = this;
		ws.on( 'message', str => {
			const message = JSON.parse( str ) as SocketMessage<any>;
			if( [ 'ack', 'error' ].includes( message.name ) ) {
				responseSubject.next( message as SocketMessageResponse<any> );
			} else {
				requestSubject.next( message as SocketMessageRequest<any> );
			}
		} );
		connectedSubject.next( true );
		ws.on( 'error', e => {
			console.error( e );
			connectedSubject.next( false );
			connectedSubject.error( e );
			requestSubject.complete();
			responseSubject.complete();
		} );
		ws.on( 'close', () => {
			connectedSubject.next( false );
			connectedSubject.complete();
			requestSubject.complete();
			responseSubject.complete();
		} );
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
			this.ws.send( JSON.stringify( { messageId, name, data } ) );
			if( !rsvp ) {
				resolve();
			}
		} );
	}

	public respond<T>( response: SocketMessageResponse<T> ) {
		this.ws.send( JSON.stringify( response ) );
	}

	public getMessages<T>( ...messages: string[] ) {
		let retval = this.requestSubject as Observable<SocketMessageRequest<T>>;
		if( messages.length ) {
			retval = retval.filter( m => messages.includes( m.name ) );
		}
		return retval;
	}
}
