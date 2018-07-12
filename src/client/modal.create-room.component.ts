import { Component, ViewChild } from '@angular/core';
import { RoomService } from './room.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component( {
	selector: 'modal-create-room',
	templateUrl: 'modal.create-room.component.html'
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

	protected async joinRoom( room: Room ) {
		const { roomService } = this;
		await roomService.joinRoom( room );
	}

	public rooms = [] as Room[];
	public roomName = '';

	public async createRoom() {
		const { roomService, roomName } = this;
		if( !roomName ) { return; }
		this.hide();
		const room = await roomService.createRoom( roomName );
		await roomService.joinRoom( room );
	}
}
