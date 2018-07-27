import { Observable, ReplaySubject, SchedulerLike, Subject, fromEvent, of } from 'rxjs';
import { map, observeOn, switchMap, takeUntil, filter } from 'rxjs/operators';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import io from 'socket.io-client';
import uuid from 'uuid/v4';
import { SessionSubject } from './session-subject';

@Injectable()
export class SocketService implements OnDestroy {
	constructor(
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike
	) {
		const { destroyed, token } = this;

		const socket = this.socket = io.connect( {
			transports: [ 'websocket' ],
			upgrade: false,
			query: { token: token.value }
		} );

		of( 'connect' )
		.pipe(
			switchMap( e => fromEvent( socket, e ) ),
			takeUntil( destroyed )
		)
		.subscribe( console.log.bind( console ) );

		fromEvent( socket, 'message' )
		.pipe(
			takeUntil( destroyed )
		)
		.subscribe( this.messages );

		of( 'error', 'connect_error', 'reconnect_error' )
		.pipe(
			switchMap( e => fromEvent( socket, e ) ),
			takeUntil( destroyed )
		)
		.subscribe( console.error.bind( console ) );

		destroyed.subscribe( () => { socket.close(); } );
	}

	public getMessages<T>( type: string ): Observable<T> {
		const { messages, scheduler } = this;
		return messages
			.pipe(
				filter( m => m.type === type ),
				map( m => m.data ),
				observeOn( scheduler )
			);
	}

	public send<T>( type: string, data: object = {} ) {
		const { socket } = this;
		return new Promise<T>( ( resolve, reject ) => {
			socket.send( { type, data }, ( error, result ) => {
				if( error ) reject( error );
				else resolve( result );
			} );
		} );
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	private readonly token = new SessionSubject<string>( 'token', uuid() );
	private readonly messages = new ReplaySubject<{ type: string, data: any }>( 20 );
	private readonly socket: SocketIOClient.Socket;
	private readonly destroyed = new Subject<true>();
}
