import Grid from './grid';
import Bounds from './bounds';
import Square from './square';

export default class Board {
	public constructor( width: number, height: number ) {
		this.reset( width, height );
	}

	public reset( width: number, height: number ) {
		const grid = this.grid = new Grid<Square>( width, height ),
			squareSize: Size = { width: 64, height: 64 },
			gutterSize: Size = { width: 4, height: 4 };
		for( let x = 0; x < width; ++x )
		for( let y = 0; y < height; ++y ) {
			const position = { x, y },
				bounds = new Bounds(
					x * ( squareSize.width + gutterSize.width ),
					y * ( squareSize.height + gutterSize.height ),
					squareSize.width,
					squareSize.height
				);
			grid.set( { x, y }, new Square( position, bounds ) );
		}
	}

	public get( point: Point ) {
		const { grid } = this;
		return grid.get( point )!;
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

	private grid: Grid<Square>;
}
