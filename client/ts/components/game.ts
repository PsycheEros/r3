import GameState from '../game-state';
import Rules from '../rules';
import Square from '../square';

import { Component, ViewChild, ElementRef } from '@angular/core';
import { SessionService } from '../services/index';

const rules = new Rules;

@Component( {
	selector: 'game',
	templateUrl: 'templates/game.html',
	providers: []
} )
export class GameComponent {
	constructor( private element: ElementRef, private session: SessionService ) {}

	@ViewChild( 'canvasElement' )
	private canvasElement: ElementRef;

	protected ngOnInit() {
		const { session } = this,
			rules = new Rules;
		session.getGameState().subscribe( gameState => {
			this.gameState = gameState;
			const { board } = gameState;
			for( let color of [ 0, 1 ] ) {
				this.scores[ color ] = rules.getScore( board, color ); 
			}
		} );
	}

	public onMouseMove( { square }: BoardMouseEvent ) {
		if( !square ) { return; }
		const { gameState: { board, turn }, session } = this;
		document.documentElement.style.cursor =
			rules.isGameOver( board )
		||	( rules.isValid( board, square.position, turn ) ) ? 'pointer' : null;
	}

	public onClick( { square }: BoardMouseEvent ) {
		if( !square ) { return; }
		const { gameState: { board }, session } = this;
		if( rules.isGameOver( board ) ) {
			session.newGame();
		} else {
			session.makeMove( square.position );
		}
	}

	public gameState = new GameState;
	public scores = [] as number[];
}

