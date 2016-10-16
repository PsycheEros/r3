import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { SessionService } from '../services/index';

@Component( {
	selector: 'chat',
	templateUrl: 'templates/chat.html',
	providers: [ SessionService ]
} )
export class ChatComponent {
	constructor( private session: SessionService ) {}

	protected ngOnInit() {
		const { session, messages } = this;
		session.getChatMessages().subscribe( message => {
			messages.push( message );
		} );
	}

	public messages = [] as ChatMessage[];

	public text = '';

	public onSubmit() {
		const { session, text } = this;
		if( !text ) return;
		this.text = '';
		session.sendChatMessage( 'Guest', text );
	}
}
