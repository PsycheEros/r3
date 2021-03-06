import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component( {
	selector: 'modal-header',
	templateUrl: 'header.component.html',
	styleUrls: [ './header.component.css' ]
} )
export class ModalHeaderComponent {
	@Input()
	public showCloseButton = true;

	@Output() closeClick = new EventEmitter<void>();
}
