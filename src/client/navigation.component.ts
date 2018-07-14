import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoomService } from './room.service';


@Component( {
	selector: 'navigation',
	templateUrl: './navigation.component.html',
	styleUrls: [ './navigation.component.scss' ]
} )
export class NavigationComponent implements OnInit, OnDestroy {
	public constructor(
		private readonly roomService: RoomService
	) {}

	public ngOnInit() {
		const { destroyed, roomService } = this;
		roomService.getJoinedRooms()
		.pipe( takeUntil( destroyed ) )
		.subscribe( rooms => {
			this.rooms = rooms;
		} );

		roomService.getCurrentRoom()
		.pipe( takeUntil( destroyed ) )
		.subscribe( room => {
			this.currentRoom = room;
		} );
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
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

	private readonly destroyed = new Subject<true>();
}
