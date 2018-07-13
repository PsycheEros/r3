import { Game } from 'src/game';
import { Rules } from 'src/rules';

import { combineLatest } from 'rxjs';

import { Component } from '@angular/core';

import { RoomService } from './room.service';

const rules = new Rules;

@Component( {
	selector: 'game',
	templateUrl: './game.component.html',
	styleUrls: [ './game.component.scss' ]
} )
export class GameComponent {
	constructor( private roomService: RoomService ) {}

	protected ngOnInit() {
		const { roomService } = this;
		const currentRoom = roomService.getCurrentRoom();
		currentRoom.subscribe( room => {
			this.room = room || null;
		} );
		combineLatest( roomService.getGames(), currentRoom,
			( games, room ) => {
				if( room ) {
					return games.filter( game => game.gameId === room.gameId )[ 0 ];
				} else {
					return null;
				}
			} )
			.subscribe( game => {
				this.game = game || null;
			} );
	}

	public room = null as Room|null;

	public game = null as Game|null;

	public onMouseMove( { square }: BoardMouseEvent ) {
		if( !square ) { return; }
		const { room: { roomId }, game: { currentGameState: { board, turn } }, roomService } = this;
		document.documentElement.style.cursor =
			rules.isGameOver( board )
		||	( rules.isValid( board, square.position, turn ) ) ? 'pointer' : null;
	}

	public onClick( { square }: BoardMouseEvent ) {
		if( !square ) { return; }
		const { room: { roomId }, game: { currentGameState: { board, turn } }, roomService } = this;
		if( rules.isGameOver( board ) ) {
			roomService.newGame( roomId );
		} else {
			roomService.makeMove( roomId, square.position );
		}
	}
}
