export default class Grid<T> {
	public constructor( public readonly width: number, public readonly height: number ) {}

	public get( x: number, y: number ) {
		this.validate( x, y );
		const key = JSON.stringify( { x, y } );
		return this.data.get( key );
	}

	public set( x: number, y: number, value: T ) {
		this.validate( x, y );
		const key = JSON.stringify( { x, y } );
		this.data.set( key, value );
	}

	private validate( x: number, y: number ) {
		if( !Number.isSafeInteger( x )  || !Number.isSafeInteger( y ) ) {
			throw new Error( `(${x}, ${y}) is not valid` );
		}
		const { width, height } = this;
		if( x < 0 || x > width || y < 0 || y > height ) {
			throw new Error( `(${x}, ${y}) is out of bounds` );
		}
	}

	private data = new Map<string, T>();
}
