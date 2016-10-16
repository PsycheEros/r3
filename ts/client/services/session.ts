import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import Board from '../../shared/board';
import * as io from 'socket.io-client'

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

		Object.assign( this, { socket } );
	}

	public getGameState() {
		const { socket } = this,
			subject = new BehaviorSubject<GameState>( null );
		socket.on( 'update', ( { board, turn, isGameOver } ) => {
			subject.next( {
				board: Board.deserialize( board ),
				turn,
				isGameOver
			} );
		} );
		return subject;
	}

	public getMessages() {
		const { socket } = this,
			subject = new ReplaySubject<Message>( 5 );
		socket.on( 'message', subject.next.bind( subject ) );
		return subject;
	}

	public makeMove( position: Point ) {
		const { socket } = this;
		socket.emit( 'move', { position } );
	}

	public newGame() {
		const { socket } = this;
		socket.emit( 'newgame' );
	}

	public sendChatMessage( user: string, message: string ) {
		const { socket } = this;
		socket.emit( 'message', { user, message } );
	}

	private socket: SocketIOClient.Socket;
}
