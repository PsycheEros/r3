import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component( {
	selector: 'chat',
	templateUrl: 'templates/chat.html'
} )
export class ChatComponent {
	@Input()
	public messages = [] as Message[];

	@Output()
	public sendMessage = new EventEmitter<SendMessageEvent>();

	public onSendMessage( input: HTMLInputElement ) {
		const { sendMessage } = this,
			{ value: message } = input;
		if( !message ) { return; }
		input.value = '';
		sendMessage.next( { message } );
	}
}
