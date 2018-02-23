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

function getAffectedSquares( board: Board, position: Point, color: Color ): Square[] {
	if( !board.boundsCheck( position ) ) { return []; }
	const square = board.get( position );
	if( !square || square.color === null || !square.enabled ) { return []; }
	function direction( { x, y }: Point, delta: Point ): Square[] {
		const squares = [] as Square[];
		for( ; ; ) {
			x += delta.x;
			y += delta.y;
			if( !board.boundsCheck( { x, y } ) ) { return []; }
			const square = board.get( { x, y } );
			if( !square || square.color === null || !square.enabled ) { return []; }
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

export class Rules {
	public isValid( board: Board, position: Point, color: Color ) {
		return getAffectedSquares( board, position, color ).length > 0;
	}

	public getValidMoves( board: Board, color: Color ) {
		const squares = [] as Square[],
			{ width, height } = board;

		for( let x = 0; x < width; ++x )
		for( let y = 0; y < height; ++y ) {
			if( this.isValid( board, square.position, color ) ) { squares.push( square ); }
		}
		return squares;
	}

	public isGameOver( board: Board ) {
		for( const color of [ 'o', 'x' ] ) {
			if( this.getValidMoves( board, color ).length > 0 ) { return false; }
		}
		return true;
	}

	public makeMove( game: Game, position: Point ) {
		const { gameStates } = game,
			lastGameState = gameStates[ gameStates.length - 1 ];
		let gameState: GameState = {
			turn: lastGameState.turn,
			board: Object.assign( {}, lastGameState.board )
		};
		const { board, turn: color } = gameState,
			squares = getAffectedSquares( board, position, color );
		for( const square of squares ) {
			square.color = color;
		}
		const { length } = squares;
		if( length > 0 ) {
			if( !this.isGameOver( board ) ) {
				do {
					gameState.turn = gameState.turn === 'x' ? 'o' : 'x';
				} while( this.getValidMoves( board, gameState.turn ).length <= 0 );
			}
			gameStates.push( gameState );
			return true;
		} else {
			return false;
		}
	}

	public getScore( board: Board, color: Color ) {
		return Array.from( board.data ).filter( c => c === color ).length;
	}

	public newGame( gameId: string ) {
		return {
			gameId,
			gameStates: [ {
				turn: 'x',
				board: {
					width: 8,
					height: 8,
					data:
						'        ' +
						'        ' +
						'        ' +
						'   ox   ' +
						'   xo   ' +
						'        ' +
						'        ' +
						'        '
				}
			} ]
		};
	}
}
