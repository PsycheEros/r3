import { Component, ViewContainerRef, HostListener } from '@angular/core';
import { RoomService } from '../services/index';

@Component( {
	selector: 'r3',
	templateUrl: 'templates/r3.html'
} )
export class R3Component {
	public constructor(
		private viewContainerRef: ViewContainerRef,
		private roomService: RoomService
	) {}

	protected ngOnInit() {
		const { roomService } = this;
		roomService.getJoinedRooms().subscribe( rooms => {
			this.rooms = rooms;
		} );
		roomService.getCurrentRoom().subscribe( room => {
			this.currentRoom = room;
		} );
	}


	protected ngAfterViewInit() {
		const keys = [ 'Backspace', ' ' ],
			codes = [ 'Backspace', 'Space' ],
			keyCodes = [ 8, 32 ],
			inputs = [ 'INPUT', 'TEXTAREA', 'SELECT' ],
			preventBackspace = ( e: KeyboardEvent ) => {
				if( !keyCodes.includes( e.keyCode || e.which )
				&& 	!keys.includes( e.key )
				&&	!codes.includes( e.code ) ) { return; }
				const { activeElement } = document,
					target = ( e.srcElement || e.target ) as HTMLInputElement|void;
				if( activeElement === document.body
				||	activeElement === document.documentElement
				||	!target
				||	!inputs.includes( target.tagName || target.nodeName )
				||	target.disabled
				||	target.readOnly
				) {
					e.cancelBubble = true;
					e.returnValue = false;
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
			};
		document.addEventListener( 'keydown', preventBackspace, false );
		document.addEventListener( 'keypress', preventBackspace, false );
	}

	public rooms = [] as Room[];

	public currentRoom = null as Room|null;

	public async setRoom( room: Room|null ) {
		const { roomService } = this;
		await roomService.setRoom( room );
	}

	public async leaveRoom( { roomId }: Room ) {
		const { roomService } = this;
		await roomService.leaveRoom( roomId );
	}
}
