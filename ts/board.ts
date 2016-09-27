import Grid from './grid';

export default class Board {
	public constructor( width: number, height: number ) {
		this.reset( width, height );
	}

	public reset( width: number, height: number ) {
		const grid = this.grid = new Grid<Square>( width, height );
		for( let x = 0; x < width; ++x )
		for( let y = 0; y < height; ++y ) {
			grid.set( { x, y }, { x, y, enabled: true, color: null } );
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

	private grid: Grid<Square>;
}
