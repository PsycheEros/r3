import { Socket } from './socket';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter'; 

interface SessionState {
	sessionId: string;
	socket: Socket;
}

const subscriptions = new WeakMap<SessionState, Subscription>();

function getResponder(): [ Promise<any>, Responder ] {
	let responder: Responder = null!;
	const promise = new Promise<any>( ( resolve, reject ) => {
		responder = { resolve, reject };
	} );
	return [ promise, responder ];
}

export class SocketManager {
	public addConnection( ws: Express.WebSocket, sessionId: string ) {
		this.deleteConnection( sessionId );

		const { map } = this,
			socket = new Socket( ws ),
			session = { sessionId, socket },
			subscription =
				socket.getMessages<any>()
				.subscribe( message => {
					const { messageSubject } = this,
						{ messageId } = message,
						[ promise, responder ] = getResponder();
					messageSubject.next( [ message, responder, session ] );

					promise.then( data => {
						socket.acknowledge( messageId, [ null, data ] );
					}, err => {
						socket.acknowledge( messageId, [ err.message, null ] );
					} );
				} );
		subscriptions.set( session, subscription );
		this.map.set( sessionId, session ); 
	}

	public deleteConnection( sessionId: string ) {
		const { map } = this,
			session = map.get( sessionId );
		if( !session ) { return; }
		const subscription = subscriptions.get( session );
		if( subscription ) {
			subscription.unsubscribe();
		}
		map.delete( sessionId ); 
	}

	public getMessages<T>( ...messages: string[] ) {
		const { messageSubject } = this;
		let retval = messageSubject as Observable<[SocketMessage<T>, Responder, SessionState]>; 
		if( messages.length ) {
			retval = retval.filter( ( [ { name } ] ) => messages.includes( name ) );
		} 
		return retval;
	}

	public send( sessionIds: string[], name: string, data: any ) {
		let sessions: SessionState[];
		if( sessionIds && sessionIds.length ) {
			sessions =
				sessionIds.map(
					sessionId => this.map.get( sessionId )!
				);
		} else {
			sessions = Object.values( this.map );
		}
		for( const session of sessions ) {
			session!.socket.send( name, data );
		}
	}

	private map = new Map<string, SessionState>();
	private messageSubject = new Subject<[SocketMessage<any>, Responder, SessionState]>();
}
