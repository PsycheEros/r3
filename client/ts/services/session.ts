import { Observable, ReplaySubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import Rules from '../rules';
import Game from '../game';
import GameState from '../game-state';
import * as io from 'socket.io-client';

@Injectable()
export class SessionService {
	constructor() {
		const socket = io.connect( '/', { transports: [ 'websocket', 'polling' ], upgrade: false } );

		for( let evt of [ 'connect' ] ) {
			socket.on( evt, console.log.bind( console, evt ) ); 
		}

		for( let evt of [ 'error', 'connect_error', 'reconnect_error' ] ) {
			socket.on( evt, console.error.bind( console, evt ) ); 
		}

		socket.on( 'message', data => {
			this.messageSubject.next( data );
		} );

		socket.on( 'update', data => {
			this.gameSubject.next( Game.deserialize( data ) );
		} );

		Object.assign( this, { socket } );
	}

	private gameSubject = new ReplaySubject<Game>();
	private gameStateSubject = this.gameSubject.map( game => game.currentGameState );
	private messageSubject = new ReplaySubject<Message>();

	public getGame( gameId: number ) {
		const { gameSubject } = this;
		return gameSubject as Observable<Game>;
	}

	public getGameState() {
		const { gameStateSubject } = this;
		return gameStateSubject as Observable<GameState>;
	}

	public makeMove( position: Point ) {
		const { socket } = this;
		socket.emit( 'move', { position } );
	}

	public newGame() {
		const { socket } = this;
		socket.emit( 'newgame' );
	}

	public getEvents<T>( message: string ) {
		const { socket } = this;
		return Observable.fromEvent( socket, message ) as Observable<T>;
	}

	public emit( message: string, ...args: any[] ) {
		const { socket } = this;
		socket.emit( message, ...args );
	}

	private socket: SocketIOClient.Socket;
}
