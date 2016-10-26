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

	public joinRoom( room: Room ) {
		const { roomService } = this;
		roomService.joinRoom( room.roomId );
	}

	public createRoom( name: string ) {
		const { createRoomModal, roomService } = this;
		if( !name ) { return };
		createRoomModal.hide();		
		roomService.createRoom( name ).then( room =>
			roomService.joinRoom( room.roomId )
		);
	}
}
