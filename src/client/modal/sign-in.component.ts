import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SessionService } from 'client/session.service';
import { nickRules, userPasswordRules } from 'src/validation';

@Component( {
	selector: 'modal-sign-in',
	templateUrl: 'sign-in.component.html',
	styleUrls: [ './sign-in.component.css' ]
} )
export class ModalSignInComponent {
	constructor(
		private readonly sessionService: SessionService
	) {}

	@ViewChild( 'signInModal' )
	protected signInModal: ModalDirective;

	public show() {
		const { signInModal } = this;
		signInModal.show();
	}

	public hide() {
		const { signInModal } = this;
		signInModal.hide();
	}

	public nick: string;
	public password: string;

	public readonly nickRules = nickRules;
	public readonly userPasswordRules = userPasswordRules;

	public async signIn() {
		const { sessionService, nick, password } = this;
		this.hide();
		await sessionService.logIn( nick, password );
	}
}
