import { Observable, Subject } from 'rxjs/Rx';

type Message<T> = {
	name: string;
	data: T;
};

const timeout = 60000;

export class Socket {
	public constructor( url: string ) {
		this.webSocket =
			Object.assign( new WebSocket( url ), {
				onopen: () => {

				},
				onmessage: ( e: MessageEvent ) => {
					const { messages } = this,
						{ name, data } = JSON.parse( e.data ) as Message<any>;
					messages.next( { name, data } );
				},
				onclose: () => {

				}
			} );
	}

	public send( name: string, data: Object = {} ) {
		return Promise.race( [
			new Promise( ( resolve, reject ) => {
				setTimeout( () => { reject( new Error( 'Timeout' ) ); }, timeout );
			} ),
			new Promise( ( resolve, reject ) => {
				const { webSocket } = this;
				webSocket.send( data );
			} )
		] );
	}

	public getMessages<T>( ...messageNames: string[] ) {
		const { messages } = this;
		let retval = messages as Observable<Message<T>>;
		if( messageNames.length ) {
			retval = messages.filter( m => messageNames.includes( m.name ) );
		}
		return retval;
	}

	private webSocket: WebSocket;
	private messages = new Subject<Message<any>>();
}
