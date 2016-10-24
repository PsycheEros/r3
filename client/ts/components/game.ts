import Game from '../game';
import GameState from '../game-state';
import Rules from '../rules';
import Square from '../square';

import { Component, Input } from '@angular/core';

const rules = new Rules;

@Component( {
	selector: 'game',
	templateUrl: 'templates/game.html',
	providers: []
} )
export class GameComponent {
	@Input()
	public game: Game;

	public onMouseMove( { square }: BoardMouseEvent ) {
		/*
		if( !square ) { return; }
		const { game: { currentGameState: { board, turn } }, session } = this;
		document.documentElement.style.cursor =
			rules.isGameOver( board )
		||	( rules.isValid( board, square.position, turn ) ) ? 'pointer' : null;
		*/
	}

	public onClick( { square }: BoardMouseEvent ) {
		/*
		if( !square ) { return; }
		const { gameState: { board }, session } = this;
		if( rules.isGameOver( board ) ) {
			session.newGame();
		} else {
			session.makeMove( square.position );
		}
		*/
	}

	public gameState = new GameState;
}

