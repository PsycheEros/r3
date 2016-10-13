import Grid from './grid';
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

function getAffectedSquares( grid: Grid<Square>, position: Point, color: number ): Square[] {
	if( !grid.boundsCheck( position ) ) { return []; }
	const square = grid.get( position );
	if( !square || !square.empty || !square.enabled ) { return []; }
	function direction( { x, y }: Point, delta: Point ): Square[] {
		const squares = [] as Square[];
		for( ; ; ) {
			x += delta.x;
			y += delta.y;
			if( !grid.boundsCheck( { x, y } ) ) { return []; }
			const square = grid.get( { x, y } );
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
	public isValid( grid: Grid<Square>, position: Point, color: number ) {
		return getAffectedSquares( grid, position, color ).length > 0;
	}

	public getValidMoves( grid: Grid<Square>, color: number ) {
		const squares = [] as Square[];
		for( const square of grid ) {
			if( square && this.isValid( grid, square.position, color ) ) { squares.push( square ); }
		}
		return squares;
	}

	public isGameOver( grid: Grid<Square>, colors: number[] ) {
		for( const color of colors ) {
			if( this.getValidMoves( grid, color ).length > 0 ) { return false; }
		}
		return true;
	}

	public makeMove( grid: Grid<Square>, position: Point, color: number ) {
		const squares = getAffectedSquares( grid, position, color );
		for( const square of squares ) {
			square.color = color;
		}
		return squares.length;
	}

	public getScore( grid: Grid<Square>, color: number ) {
		let score = 0;
		for( const square of grid ) {
			if( square && square.enabled && square.color === color ) {
				++score;
			}
		}
		return score;
	}
}
