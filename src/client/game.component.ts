import { rulesStandard } from 'src/rule-sets';

import { combineLatest, SchedulerLike, Subject } from 'rxjs';

import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { GameService } from './game.service';
import { RoomService } from './room.service';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { map, observeOn, takeUntil } from 'rxjs/operators';
import { ModalNewGameComponent } from './modal/new-game.component';
import { colors } from 'data/colors.yaml';
import { SessionService } from 'client/session.service';

const rules = rulesStandard;

@Component( {
	selector: 'game',
	templateUrl: './game.component.html',
	styleUrls: [ './game.component.scss' ]
} )
export class GameComponent implements OnInit, OnDestroy {
	constructor(
		private readonly gameService: GameService,
		private readonly roomService: RoomService,
		private readonly sessionService: SessionService,
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike
	) {}

	@ViewChild( 'newGameModal' )
	public newGameModal: ModalNewGameComponent;

	public ngOnInit() {
		const { destroyed, gameService, roomService, sessionService, scheduler } = this;

		roomService.getCurrentRoomId()
		.pipe( takeUntil( destroyed ) )
		.subscribe( roomId => {
			this.roomId = roomId;
		} );

		combineLatest(
			gameService.getGames(),
			roomService.getCurrentRoom(),
			roomService.getCurrentRoomSessions(),
			sessionService.getSessionId()
		)
		.pipe(
			map( ( [ games, room, roomSessions, sessionId ] ) => ( {
				game: room ? games.get( room.gameId ) : null,
				roomSessions,
				sessionId
			} ) ),
			takeUntil( destroyed ),
			observeOn( scheduler )
		)
		.subscribe( ( { game, roomSessions, sessionId } ) => {
			this.game = game;
			if( game ) {
				const gameState = this.gameState = game.gameStates.slice( -1 )[ 0 ];
				const c = this.colors = [ ...game.colors ];
				if( gameState.turn == null ) {
					this.canMove = false;
					this.turn = null;
				} else {
					const canMoveSession = roomSessions.filter( rs => rs.seats.includes( gameState.turn ) )[ 0 ];
					this.canMove = !canMoveSession || canMoveSession.sessionId === sessionId;
					this.turn = colors[ c[ gameState.turn ] ].displayName;
				}
			} else {
				this.canMove = false;
				this.gameState = null;
				this.turn = null;
			}
		} );
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	public canMove = false;
	public colors = null as string[];
	public turn = null as string|null;
	public roomId = null as string|null;
	public game = null as ClientGame|null;
	public gameState = null as ClientGameState|null;
	public lastMove = null as Point|null;
	public rules = null as Rules|null;

	private readonly destroyed = new Subject<true>();

	public onMouseMove( { square }: BoardMouseEvent ) {
		if( !square ) return;
		const { canMove, gameState } = this;

		document.documentElement.style.cursor =
			( rules.isGameOver( gameState )
		||	( canMove && rules.isValid( gameState, square.position, gameState.turn ) ) )
		?   'pointer'
			: null;
	}

	public onClick( { square }: BoardMouseEvent ) {
		if( !square ) return;
		const { canMove, roomId, gameState, gameService, newGameModal } = this;
		if( rules.isGameOver( gameState ) ) {
			newGameModal.show( roomId );
		} else if( canMove && rules.isValid( gameState, square.position, gameState.turn ) ) {
			gameService.makeMove( roomId, square.position );
		}
	}
}
