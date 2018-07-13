import { Component, Input, ViewChild } from '@angular/core';
import { RoomService } from './room.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component( {
	selector: 'modal-join-room',
	templateUrl: 'modal.join-room.component.html',
	styleUrls: [ './modal.join-room.component.scss' ]
} )
export class ModalJoinRoomComponent {
	constructor( private roomService: RoomService ) {}

	@ViewChild( 'joinRoomModal' )
	protected joinRoomModal: ModalDirective;

	public show( room: Room ) {
		const { joinRoomModal } = this;
		this.room = room;
		joinRoomModal.show();
	}

	public hide() {
		const { joinRoomModal } = this;
		this.room = null;
		joinRoomModal.hide();
	}

	public room: Room|null;
	public password = '';

	public async joinRoom() {
		const { roomService, room, password } = this;
		this.hide();
		await roomService.joinRoom( room, password );
	}
}
