import { Component, NgZone, ViewChild } from '@angular/core';
import { RoomService } from 'client/room.service';
import { ModalDirective } from 'ngx-bootstrap';
import { roomPasswordRules } from 'src/validation';

@Component( {
	selector: 'modal-join-room',
	templateUrl: 'join-room.component.html',
	styleUrls: [ './join-room.component.scss' ]
} )
export class ModalJoinRoomComponent {
	constructor(
		private readonly roomService: RoomService,
		private readonly zone: NgZone
	) {}

	@ViewChild( 'joinRoomModal' )
	protected joinRoomModal: ModalDirective;

	public show( room: ClientRoom ) {
		const { joinRoomModal, zone } = this;
		zone.run( () => {
			this.room = room;
			joinRoomModal.show();
		} );
	}

	public hide() {
		const { joinRoomModal } = this;
		joinRoomModal.hide();
	}

	public readonly roomPasswordRules = { ...roomPasswordRules, required: true };
	public room: ClientRoom|null;
	public password = '';

	public async joinRoom() {
		const { roomService, room, password } = this;
		this.hide();
		await roomService.joinRoom( room.id, password );
	}
}
