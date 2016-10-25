import { Component } from '@angular/core';
import { RoomService } from '../services/index';

@Component( {
	selector: 'lobby',
	templateUrl: 'templates/lobby.html'
} )
export class LobbyComponent {
	constructor( private roomService: RoomService ) {}

	protected ngOnInit() {
		const { roomService } = this;
		roomService.getRooms().subscribe( rooms => {
			this.rooms = rooms;
		} );
	}

	public rooms = [] as Room[];

	public joinRoom( roomId: number ) {
		const { roomService } = this;
		roomService.joinRoom( roomId );
	}

	public createRoom( name: string ) {
		const { roomService } = this;
		roomService.createRoom( name );
	}
}
