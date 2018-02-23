import { Grid } from './grid';
import { Bounds } from './bounds';

export class BoardMetrics {
	public reset( width: number, height: number ) {
		const grid = new Grid<SquareMetrics>( width, height ),
			squareSize: Size = { width: 64, height: 64 },
			gutterSize: Size = { width: 6, height: 6 },
			bounds = new Bounds(
				0.5,
				0.5,
				1 + width * ( squareSize.width + gutterSize.width ) + gutterSize.width,
				1 + height * ( squareSize.height + gutterSize.height ) + gutterSize.height
			);
		for( let x = 0; x < width; ++x )
		for( let y = 0; y < height; ++y ) {
			const position = { x, y },
				bounds = new Bounds(
					0.5 + x * ( squareSize.width + gutterSize.width ) + gutterSize.width,
					0.5 + y * ( squareSize.height + gutterSize.height ) + gutterSize.height,
					0.5 + squareSize.width,
					0.5 + squareSize.height
				);
			grid.set( { x, y }, { position, bounds, color: ' ' } );
		}
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

	public [Symbol.iterator]() {
		const { grid } = this;
		return grid[ Symbol.iterator ]() as IterableIterator<SquareMetrics>;
	}

	public hitTest( pt: Point ): SquareMetrics|null {
		for( const square of this ) {
			if( square.bounds.hitTest( pt ) ) {
				return square;
			}
		}
		return null;
	}

	public bounds = new Bounds( 0, 0, 0, 0 );
	private grid = new Grid<SquareMetrics>( 0, 0 );
}
