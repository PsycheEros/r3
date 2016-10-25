import { Observable, ReplaySubject } from 'rxjs/Rx';
import { Inject, Injectable } from '@angular/core';
import Rules from '../rules';
import Game from '../game';
import GameState from '../game-state';
import { SessionService } from './session';
import * as io from 'socket.io-client';

@Injectable()
export class RoomService {
	constructor( @Inject(SessionService) private sessionService: SessionService ) {
		sessionService.getEvents<Room[]>( 'rooms' ).subscribe( rooms => {
			const { allRooms } = this;
			allRooms.next( rooms );
		} );

		sessionService.getEvents<Message>( 'message' ).subscribe( message => {
			const { allMessages } = this;
			allMessages.next( message );
		} );
	}

	public getRooms() {
		const { allRooms } = this;
		return allRooms as Observable<Room[]>;
	}

	public sendMessage( roomId: number, user: string, message: string ) {
		const { sessionService } = this;
		sessionService.emit( 'sendMessage', { roomId, user, message } );
	}

	public getMessages( roomId: number ) {
		const { allMessages } = this;
		return allMessages.filter( m => m.roomId === roomId ) as Observable<Message>;
	}

	public getJoinedRooms() {
		const { allRooms, joinedRooms } = this;
		return allRooms.filter( r => joinedRooms.has( r.roomId ) ) as Observable<Room[]>;
	}

	public joinRoom( roomId: number ) {
		const { joinedRooms } = this;
		joinedRooms.add( roomId );
	}

	public quitRoom( roomId: number ) {
		const { joinedRooms } = this;
		joinedRooms.delete( roomId );
	}

	public createRoom( name: string ) {
		const { sessionService } = this;
		sessionService.emit( 'createRoom', { name } );
	}

	private allMessages = new ReplaySubject<Message>( 1 );
	private allRooms = new ReplaySubject<Room[]>( 1 );
	private joinedRooms = new Set<number>();
}
