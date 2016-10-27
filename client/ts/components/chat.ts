import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component( {
	selector: 'chat',
	templateUrl: 'templates/chat.html'
} )
export class ChatComponent {
	@Input()
	public messages = [] as Message[];

	@Output()
	public onSendMessage = new EventEmitter<SendMessageEvent>();

	public sendMessage( input: HTMLInputElement ) {
		const { onSendMessage } = this,
			{ value: message } = input;
		if( !message ) { return; }
		input.value = '';
		onSendMessage.next( { message } );
	}
}
