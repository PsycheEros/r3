import { ruleSetMap } from 'src/rule-sets';

import { combineLatest, from, SchedulerLike, Subject, of } from 'rxjs';

import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { GameService } from './game.service';
import { RoomService } from './room.service';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { map, observeOn, takeUntil, switchMap, filter } from 'rxjs/operators';
import { ModalNewGameComponent } from './modal/new-game.component';
import { colors } from 'data/colors.yaml';
import { SessionService } from './session.service';

interface Score {
	color: string;
	seat: number;
	score: number;
	player: string;
	me: boolean;
	hasTurn: boolean;
}

@Component( {
	selector: 'scoreboard',
	templateUrl: './scoreboard.component.html',
	styleUrls: [ './scoreboard.component.scss' ]
} )
export class ScoreboardComponent implements OnInit, OnDestroy {
	constructor(
		private readonly sessionService: SessionService,
		private readonly gameService: GameService,
		private readonly roomService: RoomService,
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike
	) {}

	@ViewChild( 'newGameModal' )
	public newGameModal: ModalNewGameComponent;

	public ngOnInit() {
		const { gameService, roomService, sessionService, destroyed, scheduler } = this;

		const sessionId = sessionService.getSessionId();
		const allSessions = sessionService.getSessionMap();
		const currentRoom = roomService.getCurrentRoom();

		const roomSessions =
			currentRoom
			.pipe(
				switchMap<ClientRoom, ReadonlyArray<ClientRoomSession>>( room => room ? roomService.getRoomSessions( room.id ) : of( [] ) )
			);

		const sessions =
			roomSessions
			.pipe(
				switchMap( rs =>
					allSessions
					.pipe(
						map( ss => rs.map( rs => ( {
							...ss.get( rs.sessionId ),
							seats: [ ...rs.seats ]
						} )
					) ) )
				)
			);

		const currentGame =
			combineLatest(
				gameService.getGames(),
				currentRoom
			)
			.pipe(
				map( ( [ games, room ] ) =>
					room ? games.get( room.gameId ) : null
				),
				takeUntil( destroyed ),
				observeOn( scheduler )
			);

		combineLatest( sessionId, currentGame, sessions )
		.pipe(
			map( ( [ sessionId, game, sessions ] ) => {
				if( !game ) return [];
				const rules = ruleSetMap.get( game.ruleSet );
				const gameState = game.gameStates.slice( -1 )[ 0 ];
				return game.colors.map( ( colorKey, seat ) => {
					const color = colors[ colorKey ].displayName;
					const score = rules.getScore( gameState, seat );
					let player: string = null;
					let me = false;
					for( const session of sessions ) {
						if( session.seats.includes( seat ) ) {
							player = session.nick;
							me = session.id === sessionId;
						}
					}
					const hasTurn = seat === gameState.turn;
					return { color, seat, score, player, me, hasTurn };
				} );
			} ),
			map( s => s.filter( Boolean ) ),
			takeUntil( destroyed ),
			observeOn( scheduler )
		).subscribe( scores => {
			this.scores = scores;
		} );

		currentRoom
		.pipe( takeUntil( destroyed ) )
		.subscribe( room => {
			this.roomId = room ? room.id : null;
		} );

		currentGame
		.subscribe( game => {
			this.game = game;
			if( game ) {
				const gameState = this.gameState = game.gameStates.slice( -1 )[ 0 ];
				const c = this.colors = [ ...game.colors ];
				if( gameState.turn == null ) this.turn = null;
				else this.turn = colors[ c[ gameState.turn ] ].displayName;
			} else {
				this.gameState = null;
				this.turn = null;
			}
		} );
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	public async sit( seat: number ) {
		const { roomId, roomService } = this;
		await roomService.sit( roomId, seat );
	}

	public async stand( seat: number ) {
		const { roomId, roomService } = this;
		await roomService.stand( roomId, seat );
	}

	public colors = null as string[];
	public turn = null as string|null;
	public roomId = null as string|null;
	public game = null as ClientGame|null;
	public gameState = null as ClientGameState|null;
	public lastMove = null as Point|null;
	public rules = null as Rules|null;

	public scores = [] as Score[];

	private readonly destroyed = new Subject<true>();
}
