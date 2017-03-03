import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs/Rx';
import { Inject, Injectable } from '@angular/core';
import { SocketService } from './socket';
import * as io from 'socket.io-client';

@Injectable()
export class RoomService {
	constructor( @Inject(SocketService) private readonly socketService: SocketService ) {
		socketService.getEvents<Game>( 'update' ).subscribe( game => {
			const allGames = this.allGames.getValue(),
				index = allGames.findIndex( g => g.gameId === game.gameId );
			if( index >= 0 ) {
				allGames.splice( index, 1, game );
			} else {
				allGames.push( game );
			}
			this.allGames.next( allGames );
		} );

		socketService.getEvents<Room[]>( 'rooms' ).subscribe( rooms => {
			const { allRooms } = this;
			allRooms.next( rooms );
		} );

		socketService.getEvents<string[]>( 'joinedRooms' ).subscribe( roomIds => {
			const { joinedRoomIds } = this;
			joinedRoomIds.next( roomIds );
		} );

		Observable.combineLatest( this.joinedRoomIds, this.allRooms, ( roomIds, rooms ) => {
			const joinedRooms = rooms.filter( r => roomIds.includes( r.roomId ) ),
				currentRoom = this.currentRoom.getValue();
			if( currentRoom ) {
				this.currentRoom.next( joinedRooms.filter( j => j.roomId === currentRoom.roomId )[ 0 ] || null );
			}
			return joinedRooms;
		} ).subscribe( joinedRooms => {
			this.joinedRooms.next( joinedRooms );
		} );

		socketService.getEvents<Message>( 'message' ).subscribe( message => {
			const { allMessages } = this;
			allMessages.next( message );
		} );
	}

	public getRooms() {
		const { allRooms } = this;
		return allRooms as Observable<Room[]>;
	}

	public getGames() {
		const { allGames } = this;
		return allGames;
	}

	public async newGame( roomId: string ) {
		const { socketService } = this,
			response = await socketService.send<Game>( { name: 'newGame', data: { roomId }, rsvp: true } );
		return response.data;
	}

	public async makeMove( roomId: string, position: Point ) {
		const { socketService } = this,
			response = await socketService.send( { name: 'makeMove', data: { roomId, position }, rsvp: true } );
		return response.data;
	}

	public async sendMessage( roomId: string, message: string ) {
		const { socketService } = this,
			response = await socketService.send( { name: 'sendMessage', data: { roomId, message }, rsvp: true } );
		return response.data;
	}

	public getMessages() {
		const { allMessages } = this;
		return allMessages.scan( ( arr, val ) => arr.concat( val ), [] ) as Observable<Message[]>;
	}

	public getJoinedRooms() {
		const { joinedRooms } = this;
		return joinedRooms as Observable<Room[]>;
	}

	public async joinRoom( room: Room ) {
		const { socketService, currentRoom } = this,
			{ roomId } = room,
			response = await socketService.send<Room>( { name: 'joinRoom', data: { roomId }, rsvp: true } );
		currentRoom.next( response.data );
	}

	public async leaveRoom( roomId: string ) {
		const { socketService } = this;
		await socketService.send( { name: 'leaveRoom', data: { roomId } } );
	}

	public async createRoom( name: string ) {
		const { socketService, currentRoom } = this,
			response = await socketService.send<Room>( { name: 'createRoom', data: { name }, rsvp: true } );
		return response.data;
	}

	public async setRoom( room: Room|void ) {
		const { currentRoom } = this;
		if( room ) {
			const { roomId } = room,
				joinedRooms = this.joinedRooms.getValue();
			if( !joinedRooms.some( r => r.roomId === roomId ) ) {
				throw new Error( 'Room is not joined.' );
			}
			currentRoom.next( room );
		} else {
			currentRoom.next( null );
		}
	}

	public getCurrentRoom() {
		const { currentRoom } = this;
		return currentRoom as Observable<Room>;
	}

	private allMessages = new ReplaySubject<Message>( 10 );
	private allGames = new BehaviorSubject<Game[]>( [] );
	private allRooms = new BehaviorSubject<Room[]>( [] );
	private joinedRoomIds = new BehaviorSubject<string[]>( [] );
	private joinedRooms = new BehaviorSubject<Room[]>( [] );
	private currentRoom = new BehaviorSubject<Room|null>( null );
}
