import { Grid } from 'src/grid';
import { Bounds } from 'src/bounds';
import { Square } from 'src/square';
import { zip } from 'lodash';

export class Board {
	public reset( { width, height }: Readonly<Size> ) {
		const grid = new Grid<Square>( width, height ),
			squareSize: Size = { width: 64, height: 64 },
			gutterSize: Size = { width: 6, height: 6 },
			bounds = new Bounds(
				0.5,
				0.5,
				1 + width * ( squareSize.width + gutterSize.width ) + gutterSize.width,
				1 + height * ( squareSize.height + gutterSize.height ) + gutterSize.height
			);
		for( let x = 0; x < width; ++x ) {
		for( let y = 0; y < height; ++y ) {
			const position = { x, y },
				bounds = new Bounds(
					0.5 + x * ( squareSize.width + gutterSize.width ) + gutterSize.width,
					0.5 + y * ( squareSize.height + gutterSize.height ) + gutterSize.height,
					0.5 + squareSize.width,
					0.5 + squareSize.height
				);
			grid.set( { x, y }, new Square( position, bounds ) );
		} }
		Object.assign( this, { grid, bounds } );
	}

	public get width() {
		const { grid: { width } } = this;
		return width;
	}

	public get height() {
		const { grid: { height } } = this;
		return height;
	}

	public get( { x, y }: Point ) {
		const { grid } = this;
		return grid.get( { x, y } )!;
	}

	public boundsCheck( { x, y }: Point ) {
		const { grid } = this;
		return grid.boundsCheck( { x, y } )!;
	}

	public getData() {
		return Object.freeze( Array.from( this.grid ).map( sq => sq.empty ? null : sq.color ) );
	}

	public setData( data: ReadonlyArray<number> ) {
		for( const [ color, square ] of zip( data, Array.from( this.grid ) ) ) {
			square.color = color;
		}
	}
	public getMask() {
		return Object.freeze( Array.from( this.grid ).map( sq => sq.enabled ) );
	}

	public setMask( mask: ReadonlyArray<boolean> ) {
		for( const [ enabled, square ] of zip( mask, Array.from( this.grid ) ) ) {
			square.enabled = enabled;
		}
	}

	public static fromGameState( gameState: Pick<ClientGameState,'size'|'data'|'mask'> ) {
		const board = new Board;
		board.reset( gameState.size );
		board.setData( gameState.data );
		board.setMask( gameState.mask );
		return board;
	}

	public [Symbol.iterator]() {
		const { grid } = this;
		return grid[ Symbol.iterator ]() as IterableIterator<Square>;
	}

	public hitTest( pt: Point ): Square|null {
		for( const square of this ) {
			if( square.bounds.hitTest( pt ) ) {
				return square;
			}
		}
		return null;
	}

	public bounds = new Bounds( 0, 0, 0, 0 );
	private grid = new Grid<Square>( 0, 0 );
}
