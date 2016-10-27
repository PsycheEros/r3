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
		const allMessages = new BehaviorSubject( [] as Message[] );
		const currentRoom = roomService.getCurrentRoom();
		
		roomService.getMessages().subscribe( message => {
			allMessages.next( allMessages.getValue().concat( message ) );
		} );

		this.messages = Observable.combineLatest( currentRoom, allMessages, ( room, messages ) => {
			if( room ) {
				return messages.filter( message => message.roomId === room.roomId );
			} else {
				return [];
			}
		} );

/*
		roomService.getGames( room.roomId ).subscribe( games => {
			this.game = games[ games.length - 1 ];
		} );
*/
	}

	public room: Room;

	public game = null as Game|null;

	public messages = new Observable<Message[]>();

	public sendMessage( { message }: SendMessageEvent ) {
		const { room, roomService } = this;
		roomService.sendMessage( room.roomId, 'Guest', message ); 
	}
}
