import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';

import { RoomService } from '../services/index';

@Component( {
	selector: 'chat',
	templateUrl: 'templates/chat.html'
} )
export class ChatComponent {
	constructor( private readonly roomService: RoomService ) {}

	protected ngOnInit() {
		const { roomService } = this,
			currentRoom = roomService.getCurrentRoom(),
			allMessages = roomService.getMessages();
		currentRoom.subscribe( room => {
			this.room = room;
		} );
		Observable.combineLatest( currentRoom, allMessages, ( room, messages ) => {
			if( room ) {
				return messages.filter( message => message.roomId === room.roomId );
			} else {
				return [];
			}
		} ).subscribe( messages => {
			this.messages = messages;
		} );
	}

	protected room: Room|null;

	protected messages = [] as Message[];

	public text = '';

	public async sendMessage() {
		const { roomService, room, text: message } = this;
		if( !room || !message ) { return; }
		this.text = '';
		await roomService.sendMessage( room.roomId, message );
	}
}
