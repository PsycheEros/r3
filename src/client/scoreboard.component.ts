import { ruleSetMap } from 'src/rule-sets';

import { combineLatest, from, SchedulerLike, Subject } from 'rxjs';

import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { GameService } from './game.service';
import { RoomService } from './room.service';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { map, observeOn, takeUntil, switchMap, filter } from 'rxjs/operators';
import { ModalNewGameComponent } from './modal/new-game.component';
import { colors } from 'data/colors.yaml';
import { SessionService } from './session.service';
import { tapLog } from 'src/operators';

interface Score {
	color: string;
	colorIndex: number;
	score: number;
	player: string;
	me: boolean;
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
		const allSessions = sessionService.getSessions();
		const currentRoom = roomService.getCurrentRoom();

		const roomSessions =
			currentRoom
			.pipe(
				switchMap( room => room ? roomService.getRoomSessions( room.id ) : [] )
			);

		const sessions =
			roomSessions
			.pipe(
				switchMap( rs =>
					allSessions
					.pipe(
						map( ss => rs.map( rs => ( {
							...ss.get( rs.sessionId ),
							colors: [ ...rs.colors ]
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
					games.get( room.gameId )
				),
				takeUntil( destroyed ),
				observeOn( scheduler )
			);

		combineLatest( sessionId, currentGame, sessions )
		.pipe(
			map( ( [ sessionId, game, sessions ] ) => {
				const rules = ruleSetMap.get( game.ruleSet );
				const gameState = game.gameStates.slice( -1 )[ 0 ];
				return game.colors.map( ( colorKey, colorIndex ) => {
					const color = colors[ colorKey ].displayName;
					const score = rules.getScore( gameState, colorIndex );
					let player: string = null;
					let me = false;
					for( const session of sessions ) {
						if( session.colors.includes( colorIndex ) ) {
							player = session.nick;
							me = session.id === sessionId;
						}
					}
					return { color, colorIndex, score, player, me };
				} );
			} ),
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

	public async sit( color: number ) {
		const { roomId, roomService } = this;
		await roomService.sit( roomId, color );
	}

	public async stand( color: number ) {
		const { roomId, roomService } = this;
		await roomService.stand( roomId, color );
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
