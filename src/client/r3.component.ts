import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Subject, fromEvent, of } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { RoomService } from './room.service';
import { GameService } from './game.service';

@Component( {
	selector: 'r3',
	templateUrl: './r3.component.html'
} )
export class R3Component implements AfterViewInit, OnInit, OnDestroy {
	public constructor(
		// HACK: if we don't initialize this service before joining a room, there's a race condition
		//       where we may not be listening in time for the first update event.
		private readonly gameService: GameService,
		private readonly roomService: RoomService
	) {}

	public ngOnInit() {
		const { destroyed, roomService } = this;
		roomService.getCurrentRoom()
		.pipe( takeUntil( destroyed ) )
		.subscribe( room => {
			this.currentRoom = room;
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

	public currentRoom = null as Room|null;
	private readonly destroyed = new Subject<true>();
}
