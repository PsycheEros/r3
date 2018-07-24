import { Subject, SchedulerLike, combineLatest } from 'rxjs';
import { observeOn, map, shareReplay } from 'rxjs/operators';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { toArrayMap, toMap } from 'src/operators';
import { SocketService } from './socket.service';

@Injectable()
export class SessionService implements OnDestroy {
	constructor(
		private readonly socketService: SocketService,
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike
	) {}

	public getSessions() {
		const { socketService } = this;
		return socketService.getMessages<ClientSession[]>( 'sessions' )
			.pipe(
				toMap( e => e.id ),
				shareReplay( 1 )
			);
	}

	public getCurrentSession() {
		const { scheduler } = this;
		return combineLatest( this.getSessions(), this.getSessionId() )
			.pipe(
				map( ( [ sessions, sessionId ] ) =>
					sessions.get( sessionId ) || null
				),
				observeOn( scheduler )
			);
	}

	public getRoomSessions() {
		const { socketService } = this;
		return socketService.getMessages<ClientRoomSession[]>( 'roomSessions' )
			.pipe(
				toArrayMap( e => e.roomId ),
				shareReplay( 1 )
			);
	}

	public getSessionRooms() {
		const { socketService } = this;
		return socketService.getMessages<ClientRoomSession[]>( 'roomSessions' )
			.pipe(
				toArrayMap( e => e.sessionId ),
				shareReplay( 1 )
			);
	}

	public getCurrentRoomSessions() {
		const { scheduler } = this;
		return combineLatest( this.getSessionRooms(), this.getSessionId() )
			.pipe(
				map( ( [ sr, sessionId ] ) =>
					sr.get( sessionId ) || []
				),
				observeOn( scheduler )
			);
	}

	public getSessionId() {
		const { socketService } = this;
		return socketService.getMessages<{ sessionId: string }>( 'session' ).pipe(
			map( ( { sessionId } ) => sessionId ),
			shareReplay( 1 )
		);
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	private readonly destroyed = new Subject<true>();
}
