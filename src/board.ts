import { Grid } from 'src/grid';
import { zip } from 'lodash';

export class Board {
	public reset( { width, height }: Readonly<Size> ) {
		const grid = new Grid<Square>( width, height );
		for( let x = 0; x < width; ++x ) {
		for( let y = 0; y < height; ++y ) {
			grid.set( { x, y }, { position: { x, y }, color: null, enabled: true } );
		} }
		Object.assign( this, { grid } );
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
		return Object.freeze( Array.from( this.grid ).map( sq =>
			!sq.enabled ? false
			: ( sq.color == null ) ? true
			: sq.color
		) );
	}

	public setData( data: ReadonlyArray<boolean|number> ) {
		for( const [ color, square ] of zip( data, Array.from( this.grid ) ) ) {
			if( color === true ) {
				square.color = null;
				square.enabled = true;
			} else if( color === false ) {
				square.color = null;
				square.enabled = false;
			} else {
				square.color = color;
				square.enabled = true;
			}
		}
	}

	public static fromGameState( gameState: Pick<ClientGameState,'size'|'data'> ) {
		const board = new Board;
		board.reset( gameState.size );
		board.setData( gameState.data );
		return board;
	}

	public [Symbol.iterator]() {
		const { grid } = this;
		return grid[ Symbol.iterator ]() as IterableIterator<Square>;
	}

	private grid = new Grid<Square>( 0, 0 );
}
