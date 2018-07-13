import { Component, ViewChild } from '@angular/core';
import { RoomService } from './room.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component( {
	selector: 'modal-create-room',
	templateUrl: 'modal.create-room.component.html',
	styleUrls: [ './modal.create-room.component.scss' ]
} )
export class ModalCreateRoomComponent {
	constructor( private roomService: RoomService ) {}

	@ViewChild( 'createRoomModal' )
	protected createRoomModal: ModalDirective;

	public show() {
		const { createRoomModal } = this;
		createRoomModal.show();
	}

	public hide() {
		const { createRoomModal } = this;
		createRoomModal.hide();
	}

	public rooms = [] as Room[];
	public roomName = '';
	public password = '';

	public async createRoom() {
		const { roomService, roomName, password } = this;
		if( !roomName ) { return; }
		this.hide();
		const room = await roomService.createRoom( roomName, password );
		// await roomService.joinRoom( room, password );
	}
}
