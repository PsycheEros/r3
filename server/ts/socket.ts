import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { v4 as uuid } from 'uuid';

const timeout = 60000;

export class Socket {
	public constructor( private readonly ws: Express.WebSocket ) {
		ws.on( 'message', str => {
			const message = JSON.parse( str ) as SocketMessage<any>;
		} );
	}

	public send( name: string, data: any ) {
		return new Promise( ( resolve, reject ) => {
			setTimeout( () => { reject( new Error( 'Timeout.' ) ); }, timeout );
			const messageId = uuid();
			this.ws.send( JSON.stringify( { messageId, name, data } ) );
			resolve();
		} );
	}

	public getMessages<T>() {
		const { messagesIn } = this;
		return messagesIn as Observable<SocketMessage<T>>;
	}

	private readonly messagesIn = new Subject<SocketMessage<any>>(); 
}
