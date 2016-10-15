import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import Board from '../../shared/board';

import io from 'socket.io-client';

@Injectable()
export class SessionService {
	constructor() {
		console.dir( io );
		const socket = io.connect( '/', { transports: [ 'websocket', 'polling' ], upgrade: false } );
		for( let evt of [ 'connect', 'update' ] ) {
			socket.on( evt, console.log.bind( console, evt ) ); 
		}

		for( let evt of [ 'error', 'connect_error', 'reconnect_error' ] ) {
			socket.on( evt, console.error.bind( console, evt ) ); 
		}

		const gameState = Observable.fromEvent( socket, 'update' );

		Object.assign( this, { socket } );
	}

	public observable( event: string, fn: Function ) {
		const { socket } = this;
		return Observable.fromEvent( socket, event, fn );
	}

	public on( event: string, fn: Function ) {
		const { socket } = this;
		return socket.on( event, fn );
	}

	public once( event: string, fn: Function ) {
		const { socket } = this;
		return socket.once( event, fn );
	}

	public off( event: string, fn?: Function ) {
		const { socket } = this;
		return socket.off( event, fn );
	}

	public emit( event: string, ...args: any[] ) {
		const { socket } = this;
		return socket.emit( event, ...args );
	}

	public makeMove( position: Point ) {
		const { socket } = this;
		socket.emit( 'makemove', { Position } );
	}

	public newGame() {
		const { socket } = this;
		socket.emit( 'newgame' );
	}

	public gameState: Observable<GameState>;

	private socket: SocketIOClient.Socket;
}

type GameState = {
	board: Board;
	turn: number;
	isGameOver: boolean;
};
