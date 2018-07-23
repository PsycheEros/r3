import { Observable, BehaviorSubject, ReplaySubject, SchedulerLike, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, observeOn, scan, switchMap } from 'rxjs/operators';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { Inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable()
export class RoomService {
	constructor(
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike,
		@Inject(SessionService)
		private readonly sessionService: SessionService
	) {
		sessionService.getEvents<ClientRoom[]>( 'rooms' )
		.subscribe( rooms => {
			const { allRooms } = this;
			allRooms.next( rooms );
		} );

		sessionService.getEvents<string[]>( 'joinedRooms' )
		.subscribe( roomIds => {
			const { joinedRoomIds } = this;
			joinedRoomIds.next( roomIds );
		} );

		// TODO: deal with Zalgo
		combineLatest( this.joinedRoomIds, this.allRooms, ( roomIds, rooms ) => {
			const joinedRooms = rooms.filter( r => roomIds.includes( r.id ) ),
				currentRoomId = this.currentRoomId.getValue();
			if( currentRoomId && !roomIds.includes( currentRoomId ) ) {
				this.currentRoomId.next( roomIds[ 0 ] || null );
			}
			return joinedRooms;
		} )
		.subscribe( joinedRooms => {
			this.joinedRooms.next( joinedRooms );
		} );

		sessionService.getEvents<Message>( 'message' )
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
		const { sessionService } = this;

		const commands = {
			help: async () => {
				this.statusMessage( roomId, 'Available commands:\n/?\n/help\n/nick <name>\n/say <message>\n/quit' );
			},
			'?': async () => {
				await commands.help();
			},
			nick: async ( nick: string ) => {
				await sessionService.emit( 'setNick', { nick } );
			},
			say: async () => {
				await sessionService.emit( 'sendMessage', { roomId, message: message.substring( 5 ) } );
			},
			quit: async () => {
				await this.leaveRoom( roomId );
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
			await sessionService.emit( 'sendMessage', { roomId, message } );
		}
	}

	private statusMessage( roomId: string, message: string ) {
		this.allMessages.next( { roomId, message } );
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

	public getJoinedRooms() {
		const { joinedRooms, scheduler } = this;
		return joinedRooms.pipe(
			distinctUntilChanged(),
			observeOn( scheduler )
		);
	}

	public async joinRoom( roomId: string, password: string ) {
		const { sessionService, currentRoomId } = this;
		const room = await sessionService.emit<string>( 'joinRoom', { roomId, password } );
		currentRoomId.next( room );
	}

	public async leaveRoom( roomId: string ) {
		const { sessionService } = this;
		await sessionService.emit( 'leaveRoom', { roomId } );
	}

	public async createRoom( name: string, password: string ) {
		const { currentRoomId, sessionService } = this;
		const roomId = await sessionService.emit<string>( 'createRoom', { name, password } );
		currentRoomId.next( roomId );
		return roomId;
	}

	public async setRoom( roomId: string|void ) {
		const { currentRoomId } = this;
		if( roomId ) {
			const joinedRoomIds = this.joinedRoomIds.getValue();
			if( !joinedRoomIds.includes( roomId ) ) {
				throw new Error( 'Room is not joined.' );
			}
			currentRoomId.next( roomId );
		} else {
			currentRoomId.next( null );
		}
	}

	public getCurrentRoomId() {
		const { currentRoomId, scheduler } = this;
		return currentRoomId.pipe(
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
					map( r => r.filter( r => r.id === id ) ),
					map( r => r[ 0 ] || null )
				)
			),
			observeOn( scheduler )
		);
	}

	private readonly allMessages = new ReplaySubject<Message>( 10 );
	private readonly allRooms = new BehaviorSubject<ClientRoom[]>( [] );
	private readonly joinedRoomIds = new BehaviorSubject<string[]>( [] );
	private readonly joinedRooms = new BehaviorSubject<ClientRoom[]>( [] );
	private readonly currentRoomId = new BehaviorSubject<string|null>( null );
}
