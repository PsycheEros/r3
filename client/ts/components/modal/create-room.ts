import { Component, ViewChild } from '@angular/core';
import { RoomService } from '../../services/index';
import { ModalDirective } from '../../directives/index';

@Component( {
	selector: 'modal-create-room',
	templateUrl: 'templates/modal/create-room.html'
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

	protected async createRoom() {
		const { roomService, roomName } = this;
		if( !roomName ) { return };
		this.hide();
		const room = await roomService.createRoom( roomName );
		await roomService.joinRoom( room );
	}
}
