import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter'; 
import 'rxjs/add/operator/take'; 
import { v4 as uuid } from 'uuid';

const timeout = 60000;

export class Socket {
	public constructor( private readonly ws: Express.WebSocket ) {
		const { messageSubject, connectedSubject } = this;
		ws.on( 'message', str => {
			const message = JSON.parse( str ) as SocketMessage<any>;
			messageSubject.next( message );
		} );
		connectedSubject.next( true );
		ws.on( 'error', e => {
			console.error( e );
			connectedSubject.next( false );
			connectedSubject.error( e );
			messageSubject.complete();
		} );
		ws.on( 'close', () => {
			connectedSubject.next( false );
			connectedSubject.complete();
			messageSubject.complete();
		} );
	}

	public send<T>( name: string, data: any ) {
		return new Promise<T>( ( resolve, reject ) => {
			const messageId = uuid(),
				subscription =
					this.messageSubject
						.filter( message => message.name === 'ack' && message.messageId === messageId )
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
				reject( new Error( 'Timeout.' ) );
				subscription.unsubscribe();
			}, timeout );
			this.ws.send( JSON.stringify( { messageId, name, data } ) );
		} );
	}

	public acknowledge( messageId: string, data: [ string|null, any ] ) {
		const name = 'ack';
		this.ws.send( JSON.stringify( { messageId, name, data } ) );
	}

	public getMessages<T>( ...messages: string[] ): Observable<SocketMessage<T>> {
		const { messageSubject } = this;
		let retval = messageSubject.filter( m => m.name !== 'ack' ); 
		if( messages.length ) {
			retval = retval.filter( m => messages.includes( m.name ) );
		} 
		return retval;
	}

	private readonly messageSubject = new Subject<SocketMessage<any>>();
	private readonly connectedSubject = new Subject<boolean>(); 
}
