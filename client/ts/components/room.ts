import { Component, Input } from '@angular/core';
import { RoomService } from '../services/index';

@Component( {
	selector: 'room',
	templateUrl: 'templates/room.html'
} )
export class RoomComponent {
	constructor( private roomService: RoomService ) {}

	@Input()
	public room: Room;

	public sendMessage( { message }: SendMessageEvent ) {
		const { room, roomService } = this;
		roomService.sendMessage( room.roomId, 'Guest', message ); 
	}
}
