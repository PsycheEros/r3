import Canvas from './canvas';

export default class Canvas2D extends Canvas {
	public constructor( canvas: HTMLCanvasElement ) {
		super( canvas );
		this.c2d = canvas.getContext( '2d' )!;
	}

	public clear() {
		const { c2d, width, height } = this;
		c2d.clearRect( 0, 0, width, height );
	}

	public readonly c2d: CanvasRenderingContext2D;
}
