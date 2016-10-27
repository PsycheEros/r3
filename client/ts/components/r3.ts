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
		roomService.getCurrentRoom().subscribe( room => {
			this.currentRoom = room;
		} );
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
