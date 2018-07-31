import { Board } from './board';
import { Square } from './square';

const directions: ReadonlyArray<Point> = [
	{ x:  0, y: -1 },
	{ x:  1, y: -1 },
	{ x:  1, y:  0 },
	{ x:  1, y:  1 },
	{ x:  0, y:  1 },
	{ x: -1, y:  1 },
	{ x: -1, y:  0 },
	{ x: -1, y: -1 }
];

function getAffectedSquares( board: Board, position: Point, seat: number ): Square[] {
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
			if( square.color === seat ) { return squares; }
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
	public readonly seats: number = 2;
	public readonly boardSize: Readonly<Size> = Object.freeze( { width: 8, height: 8 } );

	public isValid( gameState: Pick<ClientGameState,'size'|'data'>, position: Point, seat: number ) {
		return getAffectedSquares( Board.fromGameState( gameState ), position, seat ).length > 0;
	}

	public compareScores( score1: number, score2: number ) {
		return score2 - score1;
	}

	public getValidMoves( gameState: Pick<ClientGameState,'size'|'data'>, seat: number ) {
		const points = [] as Point[];
		const { size: { width, height } } = gameState;
		for( let x = 0; x < width; ++x ) {
		for( let y = 0; y < height; ++y ) {
			const point = { x, y };
			if( this.isValid( gameState, point, seat ) ) points.push( point );
		}
		}
		return points;
	}

	public isGameOver( gameState: Pick<ClientGameState,'size'|'data'> ) {
		const { seats } = this;
		for( let seat = 0; seat < seats; ++seat ) {
			if( this.getValidMoves( gameState, seat ).length > 0 ) return false;
		}
		return true;
	}

	public makeMove( gameState: Pick<ClientGameState,'size'|'data'|'turn'>, position: Readonly<Point> ) {
		const time = ( new Date ).toISOString();
		const { turn: prevTurn, size } = gameState;
		const board = Board.fromGameState( gameState );
		const squares = getAffectedSquares( board, position, prevTurn );
		if( squares.length === 0 ) return null;
		for( const square of squares ) {
			square.color = prevTurn;
		}
		const lastMove = Object.freeze( { ...position } );
		const data = board.getData();
		const { seats } = this;
		let turn: number|null = null;
		for( let i = 0; i < seats; ++i ) {
			const t = ( prevTurn + 1 + i ) % seats;
			if( this.getValidMoves( { size, data }, t ).length > 0 ) {
				turn = t;
				break;
			}
		}
		return { time, turn, data, size, lastMove } as ClientGameState;
	}

	public getScore( gameState: Pick<ClientGameState,'size'|'data'>, seat: number ) {
		const board = Board.fromGameState( gameState );
		let score = 0;
		for( const square of board ) {
			if( square && square.enabled && square.color === seat ) {
				++score;
			}
		}
		return score;
	}

	public getInitialState(): ClientGameState {
		const { boardSize } = this;
		const board = new Board;
		board.reset( boardSize );
		// TODO: center? gets ugly with an odd dimension
		board.get( { x: 3, y: 3 } ).color = 0;
		board.get( { x: 4, y: 3 } ).color = 1;
		board.get( { x: 3, y: 4 } ).color = 1;
		board.get( { x: 4, y: 4 } ).color = 0;
		return {
			time: ( new Date ).toISOString(),
			turn: 0,
			lastMove: null,
			data: board.getData(),
			size: Object.freeze( { ...boardSize } )
		};
	}
}

class RulesReversed extends RulesStandard {
	public readonly name: string = 'Reversed';
	public readonly ruleSet: RuleSet = RuleSet.reversed;

	public compareScores( score1: number, score2: number ) {
		return score1 - score2;
	}
}

export const rulesStandard = new RulesStandard;
export const rulesReversed = new RulesReversed;
export const ruleSets = [ rulesStandard, rulesReversed ] as Rules[];
export const ruleSetMap = new Map<RuleSet, Rules>();
for( const ruleSet of ruleSets ) {
	ruleSetMap.set( ruleSet.ruleSet, ruleSet );
}
