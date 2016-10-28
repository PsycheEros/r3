import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Component, Input } from '@angular/core';
import Game from '../game';
import { RoomService } from '../services/index';

@Component( {
	selector: 'room',
	templateUrl: 'templates/room.html'
} )
export class RoomComponent {
	constructor( private roomService: RoomService ) {}

	protected ngOnInit() {
		const { room, roomService } = this;
		const currentRoom = roomService.getCurrentRoom();

/*
		roomService.getGames( room.roomId ).subscribe( games => {
			this.game = games[ games.length - 1 ];
		} );
*/
	}

	public room: Room;

	public game = null as Game|null;
}
