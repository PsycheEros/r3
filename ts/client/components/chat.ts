import { Component } from '@angular/core';

@Component( {
	selector: 'chat',
	templateUrl: 'templates/chat.html',
	providers: []
} )
export class ChatComponent {
	public messages: ChatMessage[] = [];

	public text: string;
}

type ChatMessage = {
	user: string;
	text: string;
};
