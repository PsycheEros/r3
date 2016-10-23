import Grid from './grid';
import Bounds from './bounds';
import Square from './square';

export default class Board {
	public reset( width: number, height: number ) {
		const grid = new Grid<Square>( width, height ),
			squareSize: Size = { width: 64, height: 64 },
			gutterSize: Size = { width: 6, height: 6 },
			bounds = new Bounds(
				0,
				0,
				width * ( squareSize.width + gutterSize.width ) + gutterSize.width,
				height * ( squareSize.height + gutterSize.height ) + gutterSize.height
			);
		for( let x = 0; x < width; ++x )
		for( let y = 0; y < height; ++y ) {
			const position = { x, y },
				bounds = new Bounds(
					x * ( squareSize.width + gutterSize.width ) + gutterSize.width,
					y * ( squareSize.height + gutterSize.height ) + gutterSize.height,
					squareSize.width,
					squareSize.height
				);
			grid.set( { x, y }, new Square( position, bounds ) );
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

	public serialize(): SerializedBoard {
		const { width, height } = this;
		let data = '';
		for( const { enabled, empty, color } of this ) {
			data +=
				!enabled ? 'x'
			:	empty ? ' '
			:	color;
		}
		return { width, height, data };
	}

	public static deserialize( data: SerializedBoard ) {
		return ( new Board ).deserialize( data );
	}

	public deserialize( { width, height, data }: SerializedBoard ) {
		this.reset( width, height ); 
		let i = 0;
		for( const square of this ) {
			const char = data[ i++ ];
			switch( char ) {
			case 'x':
				square.enabled = false;
				break;
			case ' ':
				break;
			default:
				square.color = parseInt( char, 10 );
				break;
			}
		}
		return this;
	}

	public clone() {
		return Board.deserialize( this.serialize() );
	}
}
