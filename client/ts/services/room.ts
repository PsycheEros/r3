import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs/Rx';
import { Inject, Injectable } from '@angular/core';
import Rules from '../rules';
import Game from '../game';
import GameState from '../game-state';
import { SessionService } from './session';
import * as io from 'socket.io-client';

@Injectable()
export class RoomService {
	constructor( @Inject(SessionService) private sessionService: SessionService ) {
		sessionService.getEvents<SerializedGame>( 'game' ).subscribe( gameSerialized => {
			const allGames = this.allGames.getValue(),
				game = Game.deserialize( gameSerialized ),
				index = allGames.findIndex( g => g.gameId === game.gameId );
			if( index >= 0 ) {
				allGames.splice( index, 1, game );
			} else {
				allGames.push( game );
			}
			this.allGames.next( allGames );
		} );

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

	public getGames( roomId: number ) {
		const { allGames } = this;
		return allGames;
	}

	public newGame( roomId: number ) {
		const { sessionService } = this;
		sessionService.emit( 'newGame', { roomId } );
	}

	public makeMove( roomId: number, position: Point ) {
		const { sessionService } = this;
		return sessionService.emit( 'makeMove', { roomId, position } );
	}

	public sendMessage( roomId: number, user: string, message: string ) {
		const { sessionService } = this;
		return sessionService.emit( 'sendMessage', { roomId, user, message } );
	}

	public getMessages( roomId: number ) {
		const { allMessages } = this;
		return allMessages.filter( m => m.roomId === roomId ) as Observable<Message>;
	}

	public getJoinedRooms() {
		const { joinedRooms } = this;
		return joinedRooms as Observable<Room[]>;
	}

	public joinRoom( roomId: number ) {
		const { sessionService, joinedRoomIds } = this;
		const set = new Set( joinedRoomIds.getValue() );
		set.add( roomId );
		joinedRoomIds.next( Array.from( set ) );
		return Promise.resolve<void>( null );
	}

	public quitRoom( roomId: number ) {
		const { joinedRoomIds } = this;
		const set = new Set( joinedRoomIds.getValue() );
		set.delete( roomId );
		joinedRoomIds.next( Array.from( set ) );
		return Promise.resolve<void>( null );
	}

	public createRoom( name: string ) {
		const { sessionService } = this;
		return sessionService.emit<Room>( 'createRoom', { name } );
	}

	private allMessages = new ReplaySubject<Message>( 1 );
	private allGames = new BehaviorSubject<Game[]>( [] );
	private allRooms = new BehaviorSubject<Room[]>( [] );
	private joinedRoomIds = new BehaviorSubject<number[]>( [] );
	private joinedRooms = Observable.combineLatest( this.allRooms, this.joinedRoomIds, ( allRooms, joinedRoomIds ) =>
		allRooms.filter( room => joinedRoomIds.includes( room.roomId ) )
	);
}
