import { rulesStandard } from 'src/rule-sets';

import { combineLatest, from, SchedulerLike, Subject } from 'rxjs';

import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { GameService } from './game.service';
import { RoomService } from './room.service';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { filter, map, observeOn, takeUntil, switchMap } from 'rxjs/operators';
import { ModalNewGameComponent } from './modal/new-game.component';
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
		const { destroyed, gameService, roomService, scheduler } = this;

		roomService.getCurrentRoomId()
		.pipe( takeUntil( destroyed ) )
		.subscribe( roomId => {
			this.roomId = roomId;
		} );

		combineLatest( gameService.getGames(), roomService.getCurrentRoom() )
		.pipe(
			map( ( [ games, room ] ) =>
				games.get( room.gameId )
			),
			takeUntil( destroyed ),
			observeOn( scheduler )
		)
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
		const { gameState } = this;

		document.documentElement.style.cursor =
			( rules.isGameOver( gameState )
		||	rules.isValid( gameState, square.position, gameState.turn ) )
		?   'pointer'
			: null;
	}

	public onClick( { square }: BoardMouseEvent ) {
		if( !square ) return;
		const { roomId, gameState, gameService, newGameModal } = this;
		if( rules.isGameOver( gameState ) ) {
			newGameModal.show( roomId );
		} else {
			gameService.makeMove( roomId, square.position );
		}
	}
}
