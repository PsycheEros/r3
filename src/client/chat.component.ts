import { combineLatest } from 'rxjs';
import { Component } from '@angular/core';
import { RoomService } from './room.service';

@Component( {
	selector: 'chat',
	templateUrl: './chat.component.html',
	styleUrls: [ './chat.component.scss' ]
} )
export class ChatComponent {
	constructor(
		private readonly roomService: RoomService
	) {}

	protected ngOnInit() {
		const { roomService } = this,
			currentRoom = roomService.getCurrentRoom(),
			allMessages = roomService.getMessages();
		currentRoom.subscribe( room => {
			this.room = room;
		} );
		combineLatest( currentRoom, allMessages, ( room, messages ) => {
			if( room ) {
				return messages.filter( message => message.roomId === room.roomId );
			} else {
				return [];
			}
		} ).subscribe( messages => {
			this.messages = messages;
		} );
	}

	public room: Room|null;

	public messages = [] as Message[];

	public text = '';

	public async sendMessage() {
		const { roomService, room, text: message } = this;
		if( !room || !message ) { return; }
		this.text = '';
		await roomService.sendMessage( room.roomId, message );
	}
}
