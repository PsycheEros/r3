import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';

@Component( {
	selector: 'modal-choose',
	templateUrl: 'templates/modal/choose.html'
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
	public defaultButton: string|undefined;

	protected dismiss() {
		const { defaultButton } = this;
		if( defaultButton ) {
			this.choose( defaultButton );
		} else {
			this.hide();
		}
	}

	protected choose( button: string ) {
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
