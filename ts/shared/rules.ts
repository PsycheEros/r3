import Board from './board';
import Square from './square';

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
	const squares = [ square ];
	for( const delta of directions ) {
		squares.splice( squares.length, 0, ...direction( position, delta ) );
	}
	if( squares.length <= 1 ) { return []; }
	return squares;
}

export default class Rules {
	public isValid( board: Board, position: Point, color: number ) {
		return getAffectedSquares( board, position, color ).length > 0;
	}

	public getValidMoves( board: Board, color: number ) {
		const squares = [] as Square[];
		for( const square of board ) {
			if( this.isValid( board, square.position, color ) ) { squares.push( square ); }
		}
		return squares;
	}

	public getColors( board: Board ) {
		const colors = new Set<number>();
		for( let { color } of board ) {
			if( Number.isSafeInteger( color! ) ) {
				colors.add( color! );
			}
		}
		return colors;
	}

	public isGameOver( board: Board ) {
		for( const color of this.getColors( board ) ) {
			if( this.getValidMoves( board, color ).length > 0 ) { return false; }
		}
		return true;
	}

	public makeMove( board: Board, position: Point, color: number ) {
		const squares = getAffectedSquares( board, position, color );
		for( const square of squares ) {
			square.color = color;
		}
		return squares.length;
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
}
