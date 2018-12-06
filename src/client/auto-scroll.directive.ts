import { AfterViewInit, OnDestroy, Directive, ElementRef, HostListener, Input, OnChanges } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

export const enum AutoScrollDirection {
	Down = 'down',
	Up = 'up'
}

@Directive( {
	selector: '[auto-scroll]'
} )
export class AutoScrollDirective implements AfterViewInit, OnChanges, OnDestroy {
	public constructor( private readonly elementRef: ElementRef ) {}

	@Input()
	public deadZone = 10;

	@Input( 'scroll-direction' )
	public direction: AutoScrollDirection = AutoScrollDirection.Down;

	private scrolling = true;
	private readonly destroyed = new Subject<true>();

	public ngAfterViewInit() {
		new Observable<MutationRecord>( observer => {
			const mutationObserver = new MutationObserver( records => {
				for( const record of records ) {
					observer.next( record );
				}
			} );
			mutationObserver.observe( this.elementRef.nativeElement, {
				attributes: false,
				childList: true,
				subtree: true
			} );
			return () => {
				mutationObserver.disconnect();
			};
		} )
		.pipe(
			filter( () => this.scrolling ),
			takeUntil( this.destroyed )
		)
		.subscribe( () => {
			this.updateScrollPosition();
		} );
	}

	public ngOnChanges() {
		if( this.scrolling ) {
			setTimeout( () => { this.updateScrollPosition(); }, 0 );
		} else {
			this.updateScrolling();
		}
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	public updateScrollPosition() {
		const { elementRef: { nativeElement } } = this;
		switch( this.direction ) {
		case AutoScrollDirection.Up:
			nativeElement.scrollTop = 0;
			break;
		case AutoScrollDirection.Down:
			nativeElement.scrollTop = nativeElement.scrollHeight;
			break;
		}
	}

	private updateScrolling() {
		const { elementRef: { nativeElement } } = this;
		let offset: number;
		switch( this.direction ) {
		case AutoScrollDirection.Up:
			offset = nativeElement.scrollTop;
			break;
		case AutoScrollDirection.Down:
			offset = nativeElement.scrollHeight - nativeElement.scrollTop - nativeElement.clientHeight;
			break;
		}
		this.scrolling = this.deadZone > Math.abs( offset );
	}

	@HostListener( 'scroll' )
	private onScroll() {
		this.updateScrolling();
	}
}
