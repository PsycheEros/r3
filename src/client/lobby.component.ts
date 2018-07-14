import { Component, ViewChild, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { RoomService } from './room.service';
import { ModalCreateRoomComponent } from './modal/create-room.component';
import { ModalJoinRoomComponent } from './modal/join-room.component';

@Component( {
	selector: 'lobby',
	templateUrl: './lobby.component.html',
	styleUrls: [ './lobby.component.scss' ]
} )
export class LobbyComponent implements OnInit, OnDestroy {
	constructor(
		private readonly roomService: RoomService
	) {}

	@ViewChild( 'createRoomModal' )
	public createRoomModal: ModalCreateRoomComponent;

	@ViewChild( 'joinRoomModal' )
	public joinRoomModal: ModalJoinRoomComponent;

	public ngOnInit() {
		const { destroyed, roomService } = this;
		roomService.getRooms()
		.pipe( takeUntil( destroyed ) )
		.subscribe( rooms => {
			this.rooms = rooms;
		} );
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	public rooms = [] as Room[];

	public async joinRoom( room: Room ) {
		const { roomService } = this;
		const joinedRooms = await roomService.getJoinedRooms().pipe( take( 1 ) ).toPromise();
		if( joinedRooms.some( r => r.roomId === room.roomId ) ) {
			await roomService.setRoom( room );
		} else if( room.hasPassword ) {
			this.joinRoomModal.show( room );
		} else {
			await roomService.joinRoom( room, '' );
		}
	}

	private readonly destroyed = new Subject<true>();
}
