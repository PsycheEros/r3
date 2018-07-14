import { Component, ViewChild } from '@angular/core';
import { RoomService } from 'client/room.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component( {
	selector: 'modal-create-room',
	templateUrl: 'create-room.component.html',
	styleUrls: [ './create-room.component.scss' ]
} )
export class ModalCreateRoomComponent {
	constructor( private readonly roomService: RoomService ) {}

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
		await roomService.createRoom( roomName, password );
	}
}
