import { Component, ViewChild } from '@angular/core';
import { RoomService } from '../services/index';
import { ModalDirective } from 'ng2-bootstrap';

@Component( {
	selector: 'lobby',
	templateUrl: 'templates/lobby.html'
} )
export class LobbyComponent {
	constructor( private roomService: RoomService ) {}

	@ViewChild( 'createRoomModal' )
	public createRoomModal: ModalDirective;

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

	public async createRoom( name: string ) {
		const { createRoomModal, roomService } = this;
		if( !name ) { return };
		createRoomModal.hide();
		const room = await roomService.createRoom( name );
		await roomService.joinRoom( room );
	}
}
