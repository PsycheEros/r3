import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component( {
	selector: 'modal-choose',
	templateUrl: './modal.choose.component.html',
	styleUrls: [ './modal.choose.component.scss' ]
} )
export class ModalChooseComponent {
	@ViewChild('chooseModal')
	protected chooseModal: ModalDirective;

	@Output()
	public onChoose = new EventEmitter<string>();

	@Input()
	public title = '';

	@Input()
	public prompt = '';

	@Input()
	public buttons = [] as string[];

	@Input( 'default-button' )
	public defaultButton: string;

	public dismiss() {
		const { defaultButton } = this;
		if( defaultButton ) {
			this.choose( defaultButton );
		} else {
			this.hide();
		}
	}

	public choose( button: string ) {
		this.onChoose.next( button );
		this.hide();
	}

	public show() {
		const { chooseModal } = this;
		chooseModal.show();
	}

	public hide() {
		const { chooseModal } = this;
		chooseModal.hide();
	}
}
