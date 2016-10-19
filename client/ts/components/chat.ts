import { Component } from '@angular/core';
import { SessionService } from '../services/index';

@Component( {
	selector: 'chat',
	templateUrl: 'templates/chat.html',
	providers: []
} )
export class ChatComponent {
	constructor( private session: SessionService ) {}

	protected ngOnInit() {
		const { session, messages } = this;
		session.getMessages().subscribe( messages.push.bind( messages ) );
	}

	public messages = [] as Message[];

	public text = '';

	public onSubmit() {
		const { session, text } = this;
		if( !text ) { return; }
		this.text = '';
		session.sendChatMessage( 'Guest', text );
	}
}
