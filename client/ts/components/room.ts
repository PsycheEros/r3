import { Component, Input } from '@angular/core';
import { RoomService } from '../services/index';

@Component( {
	selector: 'room',
	templateUrl: 'templates/room.html'
} )
export class RoomComponent {
	constructor( private roomService: RoomService ) {}

	protected ngOnInit() {
		const { room, roomService } = this;
		roomService.getMessages( room.roomId ).subscribe( message => {
			const { messages } = this;
			messages.push( message );
		} )
	}

	@Input()
	public room: Room;

	public messages = [] as Message[];

	public sendMessage( { message }: SendMessageEvent ) {
		const { room, roomService } = this;
		roomService.sendMessage( room.roomId, 'Guest', message ); 
	}
}
