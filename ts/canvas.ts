abstract class Canvas {
	protected constructor( public readonly canvas: HTMLCanvasElement ) {}

	public abstract clear(): void;

	public get width() {
		const { canvas } = this;
		return canvas.width;
	}

	public set width( value: number ) {
		const { canvas } = this;
		canvas.width = value;
	}

	public get height() {
		const { canvas } = this;
		return canvas.height;
	}

	public set height( value: number ) {
		const { canvas } = this;
		canvas.height = value;
	}

	public screenToCanvas( { x, y }: Point ): Point {
		const { canvas, width, height } = this,
			rect = canvas.getBoundingClientRect();
		return { x: ( x - rect.left ) * ( width / rect.width ), y: ( y - rect.top ) * ( height / rect.height ) }; 
	}

	public canvasToScreen( { x, y }: Point ): Point {
		const { canvas, width, height } = this,
			rect = canvas.getBoundingClientRect();
		return { x: ( x * ( rect.width / width ) ) + rect.left, y: ( y * ( rect.height / height ) ) + rect.top }; 
	}
}

export default Canvas;
