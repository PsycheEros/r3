import { Observable, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Rules } from 'src/rules';
import { Game } from 'src/game';
import { GameState } from 'src/game-state';
import io from 'socket.io-client';

@Injectable()
export class SessionService {
	constructor() {
		const socket = io.connect( '/', { transports: [ 'websocket', 'polling' ], upgrade: false } );

		for( const evt of [ 'connect' ] ) {
			socket.on( evt, console.log.bind( console, evt ) );
		}

		for( const evt of [ 'error', 'connect_error', 'reconnect_error' ] ) {
			socket.on( evt, console.error.bind( console, evt ) );
		}

		Object.assign( this, { socket } );
	}

	public getEvents<T>( message: string ): Observable<T> {
		const { socket } = this;
		return Observable.fromEvent<T>( socket, message );
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

	private socket: SocketIOClient.Socket;
}
