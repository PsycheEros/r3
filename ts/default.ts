function createCanvas( width: number, height: number ) {
	return document.querySelector( 'body' ).appendChild(
		Object.assign( document.createElement( 'canvas' ), { width, height } )
	) as HTMLCanvasElement;
}

const body = document.querySelector( 'body' ),
	width = 960,
	height = 800,
	gl = createCanvas( width, height ).getContext( 'webgl' ),
	c2d = createCanvas( width, height ).getContext( '2d' );

c2d.clearRect( 0, 0, width, height );
gl.clearColor( 0, 0, 0, 0 );
gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
