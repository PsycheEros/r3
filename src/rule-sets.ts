import { Game } from './game';
import { GameState } from './game-state';
import { Board } from './board';
import { Square } from './square';

const directions: Point[] = [
	{ x:  0, y: -1 },
	{ x:  1, y: -1 },
	{ x:  1, y:  0 },
	{ x:  1, y:  1 },
	{ x:  0, y:  1 },
	{ x: -1, y:  1 },
	{ x: -1, y:  0 },
	{ x: -1, y: -1 }
];

function getAffectedSquares( board: Board, position: Point, color: number ): Square[] {
	if( !board.boundsCheck( position ) ) { return []; }
	const square = board.get( position );
	if( !square || !square.empty || !square.enabled ) { return []; }
	function direction( { x, y }: Point, delta: Point ): Square[] {
		const squares = [] as Square[];
		for( ; ; ) {
			x += delta.x;
			y += delta.y;
			if( !board.boundsCheck( { x, y } ) ) { return []; }
			const square = board.get( { x, y } );
			if( !square || square.empty || !square.enabled ) { return []; }
			if( square.color === color ) { return squares; }
			squares.push( square );
		}
	}
	let squares = [ square ];
	for( const delta of directions ) {
		squares = [ ...squares, ...direction( position, delta ) ];
	}
	if( squares.length <= 1 ) { return []; }
	return squares;
}

class RulesStandard implements Rules {
	public readonly name: string = 'Standard';
	public readonly ruleSet: RuleSet = RuleSet.standard;
	public readonly colors: number = 2;
	public readonly boardSize: Readonly<Point> = Object.freeze( { x: 8, y: 8 } );

	public isValid( board: Board, position: Point, color: number ) {
		return getAffectedSquares( board, position, color ).length > 0;
	}

	public compare( score1: number, score2: number ) {
		return score1 - score2;
	}

	public getValidMoves( board: Board, color: number ) {
		const squares = [] as Square[];
		for( const square of board ) {
			if( this.isValid( board, square.position, color ) ) { squares.push( square ); }
		}
		return squares;
	}

	public isGameOver( board: Board ) {
		const { colors } = this;
		for( let color = 0; color < colors; ++color ) {
			if( this.getValidMoves( board, color ).length > 0 ) { return false; }
		}
		return true;
	}

	public makeMove( game: Game, position: Point ) {
		const { gameStates } = game;
		const gameState = gameStates[ gameStates.length - 1 ].clone();
		const { board, turn } = gameState;
		const squares = getAffectedSquares( board, position, turn );
		for( const square of squares ) {
			square.color = turn;
		}
		const { length } = squares;
		const { colors } = this;
		if( length > 0 ) {
			if( !this.isGameOver( board ) ) {
				do {
					gameState.turn = ( turn + 1 ) % colors;
				} while( this.getValidMoves( board, gameState.turn ).length <= 0 );
			}
			gameStates.push( gameState );
			return true;
		} else {
			return false;
		}
	}

	public getScore( board: Board, color: number ) {
		let score = 0;
		for( const square of board ) {
			if( square && square.enabled && square.color === color ) {
				++score;
			}
		}
		return score;
	}

	public newGame( gameId: string ) {
		const game = new Game( gameId ),
			gameState = new GameState,
			{ board } = gameState,
			{ boardSize, colors } = this;
		game.rules = this;
		game.colors = [ 'black', 'white' ];
		gameState.turn = 0;
		board.reset( boardSize.x, boardSize.y );
		// TODO: center? gets ugly with an odd dimension
		board.get( { x: 3, y: 3 } ).color = colors[ 0 ];
		board.get( { x: 4, y: 3 } ).color = colors[ 1 ];
		board.get( { x: 3, y: 4 } ).color = colors[ 1 ];
		board.get( { x: 4, y: 4 } ).color = colors[ 0 ];
		game.gameStates.push( gameState );
		return game;
	}
}

class RulesReversed extends RulesStandard {
	public readonly name: string = 'Reversed';
	public readonly ruleSet: RuleSet = RuleSet.reversed;

	public compare( score1: number, score2: number ) {
		return score2 - score1;
	}
}

export const rulesStandard = new RulesStandard;
export const rulesReversed = new RulesReversed;
export const ruleSets = [ rulesStandard, rulesReversed ] as Rules[];
export const ruleSetMap = new Map<RuleSet, Rules>();
for( const ruleSet of ruleSets ) {
	ruleSetMap.set( ruleSet.ruleSet, ruleSet );
}
