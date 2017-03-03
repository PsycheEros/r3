function validate<T>( grid: Grid<T>, { x, y }: Point ) {
	if( !Number.isSafeInteger( x ) || !Number.isSafeInteger( y ) ) {
		throw new Error( `(${x}, ${y}) is not valid` );
	}
	if( !grid.boundsCheck( { x, y } ) ) {
		throw new Error( `(${x}, ${y}) is out of bounds` );
	}
}

export class Grid<T> {
	public constructor( public readonly width: number, public readonly height: number ) {}

	public boundsCheck( { x, y }: Point ) {
		const { width, height } = this;
		return x >= 0 && x < width && y >= 0 && y < height;
	}

	public get( { x, y }: Point ) {
		validate( this, { x, y } );
		const key = JSON.stringify( { x, y } );
		return this.data.get( key );
	}

	public set( { x, y }: Point, value: T ) {
		validate( this, { x, y } );
		const key = JSON.stringify( { x, y } );
		this.data.set( key, value );
	}

	public [Symbol.iterator]() {
		function *iterator( this: Grid<T> ) {
			const { width, height } = this;
			for( let x = 0; x < width; ++x )
			for( let y = 0; y < height; ++ y ) {
				yield this.get( { x, y } );
			}
		}
		return iterator.call( this ) as IterableIterator<T|undefined>;
	}

	private data = new Map<string, T>();
}
