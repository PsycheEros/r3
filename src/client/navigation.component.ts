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

		roomService.getCurrentRoomId()
		.pipe( takeUntil( destroyed ) )
		.subscribe( roomId => {
			this.currentRoomId = roomId;
		} );
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	public rooms = [] as ClientRoom[];

	public currentRoomId = null as string|null;

	public async setRoom( roomId: string|null ) {
		const { roomService } = this;
		await roomService.setRoom( roomId );
	}

	public async leaveRoom( roomId: string|null ) {
		const { roomService } = this;
		await roomService.leaveRoom( roomId );
	}

	private readonly destroyed = new Subject<true>();
}
