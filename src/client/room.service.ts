import { Observable, BehaviorSubject, ReplaySubject, SchedulerLike, combineLatest } from 'rxjs';
import { distinctUntilChanged, observeOn, scan } from 'rxjs/operators';
import { tapLog } from 'src/operators';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { Inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable()
export class RoomService {
	constructor(
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike,
		@Inject(SessionService)
		private readonly sessionService: SessionService
	) {
		sessionService.getEvents<Room[]>( 'rooms' )
		.subscribe( rooms => {
			const { allRooms } = this;
			allRooms.next( rooms );
		} );

		sessionService.getEvents<string[]>( 'joinedRooms' )
		.subscribe( roomIds => {
			const { joinedRoomIds } = this;
			joinedRoomIds.next( roomIds );
		} );

		combineLatest( this.joinedRoomIds, this.allRooms, ( roomIds, rooms ) => {
			const joinedRooms = rooms.filter( r => roomIds.includes( r.roomId ) ),
				currentRoom = this.currentRoom.getValue();
			if( currentRoom ) {
				this.currentRoom.next( joinedRooms.filter( j => j.roomId === currentRoom.roomId )[ 0 ] || null );
			}
			return joinedRooms;
		} )
		.subscribe( joinedRooms => {
			this.joinedRooms.next( joinedRooms );
		} );

		sessionService.getEvents<Message>( 'message' )
		.subscribe( message => {
			const { allMessages } = this;
			allMessages.next( message );
		} );
	}

	public getRooms() {
		const { allRooms, scheduler } = this;
		return allRooms.pipe( observeOn( scheduler ) ) as Observable<Room[]>;
	}

	public async sendMessage( roomId: string, message: string ) {
		const { sessionService } = this;
		await sessionService.emit( 'sendMessage', { roomId, message } );
	}

	public getMessages() {
		const { allMessages, scheduler } = this;
		return allMessages
		.pipe(
			distinctUntilChanged(),
			scan<Message>( ( arr, val ) => ( [ ...arr, val ] ), [] ),
			observeOn( scheduler )
		);
	}

	public getJoinedRooms() {
		const { joinedRooms, scheduler } = this;
		return joinedRooms.pipe(
			distinctUntilChanged(),
			observeOn( scheduler )
		);
	}

	public async joinRoom( room: Room, password: string ) {
		const { sessionService, currentRoom } = this,
			{ roomId } = room;
		await sessionService.emit<Room>( 'joinRoom', { roomId, password } );
		currentRoom.next( room );
	}

	public async leaveRoom( roomId: string ) {
		const { sessionService } = this;
		await sessionService.emit( 'leaveRoom', { roomId } );
	}

	public async createRoom( name: string, password: string ) {
		const { currentRoom, sessionService } = this;
		const room = await sessionService.emit<Room>( 'createRoom', { name, password } );
		currentRoom.next( room );
		return room;
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
		const { currentRoom, scheduler } = this;
		return currentRoom.pipe(
			distinctUntilChanged(),
			tapLog( 'currentRoom' ),
			observeOn( scheduler )
		);
	}

	private readonly allMessages = new ReplaySubject<Message>( 10 );
	private readonly allRooms = new BehaviorSubject<Room[]>( [] );
	private readonly joinedRoomIds = new BehaviorSubject<string[]>( [] );
	private readonly joinedRooms = new BehaviorSubject<Room[]>( [] );
	private readonly currentRoom = new BehaviorSubject<Room|null>( null );
}
