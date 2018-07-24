import { Component, ViewChild, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil, map } from 'rxjs/operators';
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

	public joinedRoomIds = [] as string[];

	public ngOnInit() {
		const { destroyed, roomService } = this;
		roomService.getRooms()
		.pipe( takeUntil( destroyed ) )
		.subscribe( rooms => {
			this.rooms = rooms;
		} );

		roomService.getJoinedRoomIds()
		.pipe( takeUntil( destroyed ) )
		.subscribe( roomIds => {
			this.joinedRoomIds = roomIds;
		} );
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	public rooms = [] as ClientRoom[];

	public async joinRoom( room: ClientRoom ) {
		const { joinedRoomIds, roomService } = this;
		if( joinedRoomIds.includes( room.id ) ) {
			await this.showRoom( room );
		} else if( room.hasPassword ) {
			this.joinRoomModal.show( room );
		} else {
			await roomService.joinRoom( room.id, '' );
		}
	}

	public async showRoom( room: ClientRoom ) {
		const { joinedRoomIds, roomService } = this;
		if( joinedRoomIds.includes( room.id ) ) {
			await roomService.setRoom( room.id );
		}
	}

	private readonly destroyed = new Subject<true>();
}
