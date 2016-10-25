import { Component, ViewContainerRef } from '@angular/core';
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
	}

	public rooms = [] as Room[];

	public closeRoom( roomId: number ) {
		const { roomService } = this;
		roomService.quitRoom( roomId );
	}
}
