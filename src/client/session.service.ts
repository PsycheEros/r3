import { Subject, SchedulerLike, combineLatest, BehaviorSubject } from 'rxjs';
import { observeOn, map, shareReplay, takeUntil } from 'rxjs/operators';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { toArrayMap, toMap } from 'src/operators';
import { SocketService } from './socket.service';
import { SessionSubject } from './session-subject';

@Injectable()
export class SessionService implements OnDestroy {
	constructor(
		private readonly socketService: SocketService,
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike
	) {
		const { destroyed } = this;

		socketService.getMessages<ClientRoomSession[]>( 'roomSessions' )
		.pipe(
			map( s => s || [] ),
			takeUntil( destroyed )
		)
		.subscribe( this.roomSessions );

		socketService.getMessages<ClientSession[]>( 'sessions' )
		.pipe(
			map( s => s || [] ),
			takeUntil( destroyed )
		)
		.subscribe( this.sessions );

		socketService.getMessages<{ sessionId: string }>( 'session' )
		.pipe(
			map( ( { sessionId } ) => sessionId ),
			takeUntil( destroyed )
		)
		.subscribe( this.sessionId );
	}

	public getSessionMap() {
		const { sessions, scheduler } = this;
		return sessions
			.pipe(
				toMap( e => e.id ),
				observeOn( scheduler )
			);
	}

	public getCurrentSession() {
		const { scheduler } = this;
		return combineLatest( this.getSessionMap(), this.getSessionId() )
			.pipe(
				map( ( [ sessions, sessionId ] ) =>
					sessions.get( sessionId ) || null
				),
				observeOn( scheduler )
			);
	}

	public getRoomSessionMqp() {
		const { roomSessions, scheduler } = this;
		return roomSessions
			.pipe(
				toArrayMap( e => e.roomId ),
				observeOn( scheduler )
			);
	}

	public getSessionRoomMap() {
		const { roomSessions, scheduler } = this;
		return roomSessions
			.pipe(
				toArrayMap( e => e.sessionId ),
				observeOn( scheduler )
			);
	}

	public getCurrentRoomSessions() {
		const { scheduler } = this;
		return combineLatest( this.getSessionRoomMap(), this.sessionId )
			.pipe(
				map( ( [ sr, sessionId ] ) =>
					sr.get( sessionId ) || []
				),
				observeOn( scheduler )
			);
	}

	public getSessionId() {
		const { sessionId, scheduler } = this;
		return sessionId.pipe( observeOn( scheduler ) );
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	private readonly sessionId = new SessionSubject<string>( 'sessionId', null );
	private readonly sessions = new SessionSubject<ClientSession[]>( 'sessions', [] );
	private readonly roomSessions = new SessionSubject<ClientRoomSession[]>( 'roomSessions', [] );
	private readonly destroyed = new Subject<true>();
}
