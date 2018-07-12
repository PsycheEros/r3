import { Component, ViewChild } from '@angular/core';
import { RoomService } from './room.service';
import { ModalCreateRoomComponent } from './modal.create-room.component';

@Component( {
	selector: 'lobby',
	templateUrl: './lobby.component.html'
} )
export class LobbyComponent {
	constructor( private roomService: RoomService ) {}

	@ViewChild( 'createRoomModal' )
	public createRoomModal: ModalCreateRoomComponent;

	protected ngOnInit() {
		const { roomService } = this;
		roomService.getRooms().subscribe( rooms => {
			this.rooms = rooms;
		} );
	}

	public rooms = [] as Room[];

	public async joinRoom( room: Room ) {
		const { roomService } = this;
		await roomService.joinRoom( room );
	}

	public roomName = '';

	public async createRoom() {
		const { createRoomModal, roomService, roomName } = this;
		if( !roomName ) { return; }
		createRoomModal.hide();
		const room = await roomService.createRoom( roomName );
		await roomService.joinRoom( room );
	}
}
