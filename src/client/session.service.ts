import { Subject, Observable, SchedulerLike, fromEvent, of } from 'rxjs';
import { observeOn, switchMap, takeUntil } from 'rxjs/operators';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import io from 'socket.io-client';
import { tapLog } from 'src/operators';

@Injectable()
export class SessionService implements OnDestroy {
	constructor(
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike
	) {
		const { destroyed } = this;
		const socket = this.socket = io.connect( '/', { transports: [ 'websocket', 'polling' ], upgrade: false } );

		of( 'connect' )
		.pipe(
			switchMap( e => fromEvent( socket, e ) ),
			takeUntil( destroyed )
		)
		.subscribe( console.log.bind( console ) );

		of( 'error', 'connect_error', 'reconnect_error' )
		.pipe(
			switchMap( e => fromEvent( socket, e ) ),
			takeUntil( destroyed )
		)
		.subscribe( console.error.bind( console ) );

		destroyed.subscribe( () => { socket.close(); } );
	}

	public getEvents<T>( message: string ): Observable<T> {
		const { socket, scheduler } = this;
		return fromEvent<T>( socket, message )
			.pipe( observeOn( scheduler ) );
	}

	public emit<T>( message: string, data: Object = {} ) {
		const { socket } = this;
		return new Promise<T>( ( resolve, reject ) => {
			socket.emit( message, data, ( error, result ) => {
				if( error ) reject( error );
				else resolve( result );
			} );
		} );
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	private socket: SocketIOClient.Socket;
	private readonly destroyed = new Subject<true>();
}
