import { rulesStandard } from 'src/rule-sets';

import { combineLatest, SchedulerLike, Subject } from 'rxjs';

import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { GameService } from './game.service';
import { RoomService } from './room.service';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { observeOn, takeUntil } from 'rxjs/operators';
import { ModalNewGameComponent } from './modal/new-game.component';
import { Board } from 'src/board';
import { colors } from 'data/colors.yaml';

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
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike
	) {}

	@ViewChild( 'newGameModal' )
	public newGameModal: ModalNewGameComponent;

	public ngOnInit() {
		const { gameService, roomService, destroyed, scheduler } = this;
		const currentRoom = roomService.getCurrentRoom();
		currentRoom.subscribe( room => {
			this.room = room || null;
		} );
		combineLatest( gameService.getGames(), currentRoom,
			( games, room ) => room
			? games.filter( game => game.gameId === room.gameId )[ 0 ] || null
			: null
		)
		.pipe(
			takeUntil( destroyed ),
			observeOn( scheduler )
		)
		.subscribe( game => {
			this.game = game;
			if( game ) {
				const gameState = this.gameState = game.gameStates.slice( -1 )[ 0 ];
				this.board = Board.fromGame( game, gameState );
				this.lastMove = gameState.lastMove;
				if( gameState.turn == null ) this.turn = null;
				else this.turn = colors[ game.colors[ gameState.turn ] ].displayName;
			} else {
				this.gameState = null;
				this.board = null;
				this.lastMove = null;
				this.turn = null;
			}
		} );
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	public turn = null as string|null;
	public room = null as Room|null;
	public game = null as Game|null;
	public gameState = null as GameState|null;
	public lastMove = null as Point|null;
	public board = new Board;
	public rules = null as Rules|null;

	private readonly destroyed = new Subject<true>();

	public onMouseMove( { square }: BoardMouseEvent ) {
		if( !square ) return;
		const { game, gameState } = this;

		document.documentElement.style.cursor =
			( rules.isGameOver( game, gameState )
		||	rules.isValid( game, gameState, square.position, gameState.turn ) )
		?   'pointer'
			: null;
	}

	public onClick( { square }: BoardMouseEvent ) {
		if( !square ) return;
		const { room, game, gameState, gameService, newGameModal } = this;
		if( rules.isGameOver( game, gameState ) ) {
			newGameModal.show( room );
		} else {
			gameService.makeMove( room.roomId, square.position );
		}
	}
}
