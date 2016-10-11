import Canvas2D from './canvas2d';
import Canvas3D from './canvas3d';
import Board from './board';
import Square from './square';

function createCanvas( width: number, height: number ) {
	return document.querySelector( 'body' )!.appendChild(
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
	const { c2d } = canvas[ '2d' ];

	let selectedSquare: Square|null = null;
	function render( time: number ) {
		canvas[ '2d' ].clear();
		for( const { position: { x, y }, bounds } of board ) {
			c2d.fillStyle = ( x + y ) % 2 === 0 ? 'black' : 'white';
			c2d.fillRect( bounds.left, bounds.top, bounds.width, bounds.height );
		}
		if( selectedSquare ) {
			c2d.strokeStyle = '#f00';
			c2d.strokeRect( selectedSquare.bounds.left, selectedSquare.bounds.top, selectedSquare.bounds.width, selectedSquare.bounds.height );
		}
		requestAnimationFrame( render );
	}
	requestAnimationFrame( render );

	document.addEventListener( 'mousemove', ( { clientX, clientY } ) => {
		const { x, y } = canvas[ '2d' ].screenToCanvas( { x: clientX, y: clientY } );
		selectedSquare = board.hitTest( { x, y } );
	}, false );
} )();
