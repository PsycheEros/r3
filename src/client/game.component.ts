import { Game } from 'src/game';
import { rulesStandard } from 'src/rule-sets';

import { combineLatest, SchedulerLike } from 'rxjs';

import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { GameService } from './game.service';
import { RoomService } from './room.service';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { observeOn } from 'rxjs/operators';
import { ModalNewGameComponent } from './modal/new-game.component';

const rules = rulesStandard;

@Component( {
	selector: 'game',
	templateUrl: './game.component.html',
	styleUrls: [ './game.component.scss' ]
} )
export class GameComponent implements OnInit {
	constructor(
		private readonly gameService: GameService,
		private readonly roomService: RoomService,
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike
	) {}

	@ViewChild( 'newGameModal' )
	public newGameModal: ModalNewGameComponent;

	public ngOnInit() {
		const { gameService, roomService, scheduler } = this;
		const currentRoom = roomService.getCurrentRoom();
		currentRoom.subscribe( room => {
			this.room = room || null;
		} );
		combineLatest( gameService.getGames(), currentRoom,
			( games, room ) => room
			? games.filter( game => game.gameId === room.gameId )[ 0 ] || null
			: null
		)
		.pipe( observeOn( scheduler ) )
		.subscribe( game => {
			this.game = game;
		} );
	}

	public room = null as Room|null;
	public game = null as Game|null;
	public rules = null as Rules|null;

	public onMouseMove( { square }: BoardMouseEvent ) {
		if( !square ) { return; }
		const { game: { currentGameState: { board, turn } } } = this;
		document.documentElement.style.cursor =
			rules.isGameOver( board )
		||	( rules.isValid( board, square.position, turn ) ) ? 'pointer' : null;
	}

	public onClick( { square }: BoardMouseEvent ) {
		if( !square ) return;
		const { room, game: { currentGameState: { board } }, gameService, newGameModal } = this;
		if( rules.isGameOver( board ) ) {
			newGameModal.show( room );
		} else {
			gameService.makeMove( room.roomId, square.position );
		}
	}
}
