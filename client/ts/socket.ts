import { Observable, Subject } from 'rxjs/Rx';
import { v4 as uuid } from 'uuid';

const timeout = 60000;

export class Socket {
	public constructor( private readonly url: string ) {
		this.connect();
	}

	private connect() {
		const { url } = this;
		this.webSocket =
			Object.assign( new WebSocket( url ), {
				onopen: () => {
					this.connectionAttempts = 0;
				},
				onmessage: ( e: MessageEvent ) => {
					const { messagesIn } = this,
						{ messageId, name, data } = JSON.parse( e.data ) as SocketMessage<any>;
					messagesIn.next( { messageId, name, data } );
				},
				onclose: () => {
					const delay = Math.random() * Math.min( Math.pow( 2, ++this.connectionAttempts ) - 1, 30 ) * 1000;
					setTimeout( () => { this.connect(); }, delay );
				}
			} );
	}

	private connectionAttempts = 0;

	public send<T>( name: string, data: Object = {} ) {
		return new Promise<T>( ( resolve, reject ) => {
			const messageId = uuid(),
				subscription =
					this.messagesIn
					.filter( m => m.name === 'ack' && m.messageId === messageId )
					.subscribe( ( { data } ) => {
						resolve( data );
						subscription.unsubscribe();
					} );

			setTimeout( () => {
				reject( new Error( 'Timeout' ) );
				subscription.unsubscribe();
			}, timeout );
			const { webSocket } = this;
			try {
				webSocket.send( JSON.stringify( { messageId, name, data } ) );
			} catch( ex ) {
				reject( ex );
			}
		} );
	}

	public getMessages<T>( ...messageNames: string[] ) {
		const { messagesIn } = this;
		let retval = messagesIn as Observable<SocketMessage<T>>;
		if( messageNames.length ) {
			retval = retval.filter( m => messageNames.includes( m.name ) );
		}
		return retval;
	}

	private webSocket: WebSocket;
	private messagesIn = new Subject<SocketMessage<any>>();
}
