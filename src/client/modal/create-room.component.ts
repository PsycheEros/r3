import { Component, ViewChild } from '@angular/core';
import { RoomService } from 'client/room.service';
import { ModalDirective } from 'ngx-bootstrap';
import { roomNameRules, roomPasswordRules } from 'src/validation';

@Component( {
	selector: 'modal-create-room',
	templateUrl: 'create-room.component.html',
	styleUrls: [ './create-room.component.css' ]
} )
export class ModalCreateRoomComponent {
	constructor(
		private readonly roomService: RoomService
	) {}

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

	public readonly roomNameRules: StringValidationRules = roomNameRules;
	public readonly roomPasswordRules: StringValidationRules = roomPasswordRules;
	public rooms = [] as ClientRoom[];
	public roomName = '';
	public password = '';

	public async createRoom() {
		const { roomService, roomName, password } = this;
		this.hide();
		await roomService.createRoom( roomName, password );
	}
}
