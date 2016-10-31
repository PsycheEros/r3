import Game from '../game';
import GameState from '../game-state';
import Rules from '../rules';
import Square from '../square';

import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Component, Input } from '@angular/core';

import { RoomService } from '../services/index';

const rules = new Rules;

@Component( {
	selector: 'game',
	templateUrl: 'templates/game.html'
} )
export class GameComponent {
	constructor( private roomService: RoomService ) {}

	protected ngOnInit() {
		const { roomService } = this;
		const currentRoom = roomService.getCurrentRoom();
		currentRoom.subscribe( room => {
			this.room = room || null;
		} );
		Observable.combineLatest( roomService.getGames(), currentRoom,
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
