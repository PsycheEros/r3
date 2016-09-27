import Canvas from './canvas';

export default class Canvas3D extends Canvas {
	public constructor( canvas: HTMLCanvasElement ) {
		super( canvas );
		this.gl = canvas.getContext( 'webgl' )!;
	}

	public clear() {
		const { gl } = this;
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	}

	public readonly gl: WebGLRenderingContext;
}