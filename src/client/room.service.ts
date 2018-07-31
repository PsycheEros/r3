import { Observable, ReplaySubject, SchedulerLike, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, map, observeOn, scan, switchMap, take } from 'rxjs/operators';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { Inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { SocketService } from './socket.service';
import { SessionSubject } from './session-subject';
import { mapFilter } from 'src/operators';

@Injectable()
export class RoomService {
	constructor(
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike,
		private readonly sessionService: SessionService,
		private readonly socketService: SocketService
	) {
		socketService.getMessages<ClientRoom[]>( 'rooms' )
		.subscribe( rooms => {
			const { allRooms } = this;
			allRooms.next( rooms );
		} );

		socketService.getMessages<Message>( 'message' )
		.subscribe( message => {
			const { allMessages } = this;
			allMessages.next( message );
		} );
	}

	public getRooms() {
		const { allRooms, scheduler } = this;
		return allRooms.pipe( observeOn( scheduler ) ) as Observable<ClientRoom[]>;
	}

	public async sendMessage( roomId: string, message: string ) {
		const { sessionService, socketService } = this;

		const commands = {
			help: async () => {
				this.statusMessage( roomId, 'Available commands:\n/?\n/help\n/nick <name>\n/part\n/say <message>\n/who' );
			},
			'?': async () => {
				await commands.help();
			},
			nick: async ( nick: string ) => {
				await socketService.send( 'setNick', { nick } );
			},
			say: async () => {
				await socketService.send( 'sendMessage', { roomId, message: message.substring( 5 ) } );
			},
			part: async () => {
				await this.leaveRoom( roomId );
			},
			who: async () => {
				const nicks =
					await combineLatest(
						this.getRoomSessions( roomId ),
						sessionService.getSessionMap()
					).pipe(
						map( ( [ rs, s ] ) =>
							[ ...rs.values() ]
							.map( ( { sessionId } ) => s.get( sessionId ).nick )
						),
						take( 1 )
					)
					.toPromise();
				this.statusMessage( roomId, `Users in room:\n${nicks.join('\n')}` );
			}
		};

		if( message.startsWith( '/' ) ) {
			const [ cmd, ...params ] = message.substring( 1 ).trim().split( /\s+/g );
			if( commands.hasOwnProperty( cmd ) ) {
				await commands[ cmd ]( ...params );
			} else {
				this.statusMessage( roomId, `Unknown command: /${cmd}` );
			}
		} else {
			await socketService.send( 'sendMessage', { roomId, message } );
		}
	}

	private statusMessage( roomId: string, message: string ) {
		this.allMessages.next( { roomId, message } );
	}

	public async sit( roomId: string, seat: number ) {
		const { socketService } = this;
		socketService.send( 'sit', { roomId, seat } );
	}

	public async stand( roomId: string, seat: number ) {
		const { socketService } = this;
		socketService.send( 'stand', { roomId, seat } );
	}

	public getMessages() {
		const { allMessages, scheduler } = this;
		return allMessages
		.pipe(
			distinctUntilChanged(),
			scan<Message>( ( arr, val ) => ( [ ...arr, val ] ), [] ),
			observeOn( scheduler )
		);
	}

	public getJoinedRoomIds() {
		const { sessionService } = this;
		return sessionService.getCurrentRoomSessions().pipe(
			map( rs => rs.map( rs => rs.roomId ) )
		);
	}

	public getJoinedRooms() {
		const { scheduler } = this;
		return combineLatest( this.allRooms, this.getJoinedRoomIds() )
		.pipe(
			map( ( [ allRooms, joinedRoomIds ] ) =>
				allRooms.filter( r => joinedRoomIds.includes( r.id ) )
			),
			observeOn( scheduler )
		);
	}

	public getRoomSessions( roomId: string ) {
		const { sessionService } = this;
		return sessionService.getRoomSessionMqp()
		.pipe(
			map( rs => rs.get( roomId ) || [] )
		);
	}

	public async joinRoom( roomId: string, password: string ) {
		const { socketService, currentRoomId } = this;
		const room = await socketService.send<string>( 'joinRoom', { roomId, password } );
		currentRoomId.next( room );
	}

	public async leaveRoom( roomId: string ) {
		const { socketService } = this;
		await socketService.send( 'leaveRoom', { roomId } );
		this.currentRoomId.next( null );
	}

	public async createRoom( name: string, password: string ) {
		const { currentRoomId, socketService } = this;
		const roomId = await socketService.send<string>( 'createRoom', { name, password } );
		currentRoomId.next( roomId );
		return roomId;
	}

	public async setRoom( roomId: string|void ) {
		const { currentRoomId } = this;
		sessionStorage.setItem( 'currentRoomId', roomId || null );
		if( roomId ) {
			currentRoomId.next( roomId );
		} else {
			currentRoomId.next( null );
		}
	}

	public getCurrentRoomId() {
		const { currentRoomId, scheduler, sessionService } = this;
		return combineLatest( sessionService.getCurrentRoomSessions(), currentRoomId )
		.pipe(
			map( ( [ rs, rid ] ) =>
				rs.some( ( { roomId } ) => roomId === rid )
			?	rid
			:	null
			),
			distinctUntilChanged(),
			observeOn( scheduler )
		);
	}

	public getCurrentRoom() {
		const { allRooms, currentRoomId, scheduler } = this;
		return currentRoomId.pipe(
			distinctUntilChanged(),
			switchMap( id =>
				allRooms.pipe(
					mapFilter( r => r.id === id ),
					map( r => r[ 0 ] || null )
				)
			),
			observeOn( scheduler )
		);
	}

	public getCurrentRoomSessions() {
		const { currentRoomId, sessionService, scheduler } = this;
		return currentRoomId.pipe(
			distinctUntilChanged(),
			switchMap( roomId =>
				sessionService.getRoomSessionMqp().pipe(
					map( rs => rs.get( roomId ) || [] )
				)
			),
			observeOn( scheduler )
		);
	}

	private readonly allMessages = new ReplaySubject<Message>( 10 );
	private readonly allRooms = new SessionSubject<ClientRoom[]>( 'rooms', [] );
	private readonly currentRoomId = new SessionSubject<string|null>( 'currentRoomId', null );
}
