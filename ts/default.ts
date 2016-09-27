import Canvas2D from './canvas2d';
import Canvas3D from './canvas3d';
import Board from './board';

function createCanvas( width: number, height: number ) {
	return document.querySelector( 'body' ).appendChild(
		Object.assign( document.createElement( 'canvas' ), { width, height } )
	) as HTMLCanvasElement;
}

const body = document.querySelector( 'body' ),
	width = 960,
	height = 800,
	canvas = {
		'2d': new Canvas2D( createCanvas( width, height ) ),
		'3d': new Canvas3D( createCanvas( width, height ) )
	};

( () => {
	const board = new Board( 8, 8 );
	const squareSize = 64;
	const { c2d } = canvas[ '2d' ];
	for( const { x, y } of board ) {
		c2d.fillStyle = ( x + y ) % 2 === 0 ? 'black' : 'white';
		c2d.fillRect( x * squareSize, y * squareSize, squareSize, squareSize );
	}
	const info = body.appendChild( document.createElement( 'div' ) ) as HTMLElement;
	Object.assign( info.style, {
		whiteSpace: 'pre',
		position: 'fixed',
		bottom: 0,
		left: 0,
		right: 0
	} );
	document.addEventListener( 'mousemove', ( { clientX, clientY } ) => {
		const { x, y } = canvas[ '2d' ].screenToCanvas( { x: clientX, y: clientY } );
		const { x: roundX, y: roundY } = canvas[ '2d' ].canvasToScreen( { x, y } );
		info.textContent = `
Client: (${clientX}, ${clientY}
Screen: (${x}, ${y})
Round: (${roundX}, ${roundY})
`;
	}, false );
} )();
