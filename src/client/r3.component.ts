import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Subject, fromEvent, of } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { RoomService } from './room.service';

@Component( {
	selector: 'r3',
	templateUrl: './r3.component.html',
	styleUrls: [ './r3.component.css' ]
} )
export class R3Component implements AfterViewInit, OnInit, OnDestroy {
	public constructor(
		private readonly roomService: RoomService
	) {}

	public ngOnInit() {
		const { destroyed, roomService } = this;

		roomService.getCurrentRoomId()
		.pipe( takeUntil( destroyed ) )
		.subscribe( roomId => {
			this.currentRoomId = roomId;
		} );
	}

	public ngAfterViewInit() {
		const { destroyed } = this,
			keys = [ 'Backspace', ' ' ],
			codes = [ 'Backspace', 'Space' ],
			inputs = [ 'INPUT', 'TEXTAREA', 'SELECT' ];

		of( 'keydown', 'keypress' )
		.pipe(
			mergeMap( evtName => fromEvent<KeyboardEvent>( document, evtName, { capture: false } ) ),
			filter<KeyboardEvent>( e => keys.includes( e.key ) || codes.includes( e.code ) ),
			filter<KeyboardEvent>( e => {
				const { activeElement } = document,
					target = ( e.srcElement || e.target ) as HTMLInputElement|void;
					return activeElement === document.body
					|| activeElement === document.documentElement
					|| !target
					|| !inputs.includes( target.tagName || target.nodeName )
					|| target.disabled
					|| target.readOnly;
			} ),
			takeUntil( destroyed )
		).subscribe( e => {
			e.cancelBubble = true;
			e.returnValue = false;
			e.stopPropagation();
			e.preventDefault();
		} );
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	public currentRoomId = null as string|null;
	private readonly destroyed = new Subject<true>();
}
