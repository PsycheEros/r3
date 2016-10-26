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
		roomService.getMessages( room.roomId ).subscribe( message => {
			const { messages } = this;
			messages.push( message );
		} );

		roomService.getGames( room.roomId ).subscribe( game => {
			this.game = game;
		} );
	}

	@Input()
	public room: Room;

	public game = null as Game|null;

	public messages = [] as Message[];

	public sendMessage( { message }: SendMessageEvent ) {
		const { room, roomService } = this;
		roomService.sendMessage( room.roomId, 'Guest', message ); 
	}
}
