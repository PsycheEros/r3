import { Directive, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';

@Directive( {
	selector: '[modal]',
	exportAs: 'modal'
} )
export class ModalDirective {
	public constructor( private readonly element: ElementRef, private readonly renderer: Renderer ) {}

	public ngAfterViewInit() {
		const { element: { nativeElement } } = this,
			$e = $( nativeElement );
		$e.on( 'show.bs.modal', () => {
			this.onShow.emit( this );
		} );
		$e.on( 'shown.bs.modal', () => {
			this.onShown.emit( this );
		} );
		$e.on( 'hide.bs.modal', () => {
			this.onHide.emit( this );
		} );
		$e.on( 'hidden.bs.modal', () => {
			this.onHidden.emit( this );
		} );
	}

	@Output()
	public readonly onShow = new EventEmitter<ModalDirective>();

	@Output()
	public readonly onShown = new EventEmitter<ModalDirective>();

	@Output()
	public readonly onHide = new EventEmitter<ModalDirective>();

	@Output()
	public readonly onHidden = new EventEmitter<ModalDirective>();

	public show() {
		const { element: { nativeElement } } = this;
		$( nativeElement ).modal( 'show' );
	}

	public hide() {
		const { element: { nativeElement } } = this;
		$( nativeElement ).modal( 'hide' );
	}
}
