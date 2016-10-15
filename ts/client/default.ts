import Canvas2D from './canvas2d';
import Canvas3D from './canvas3d';
import Board from '../shared/board';
import Square from '../shared/square';
import Rules from '../shared/rules';
import io from 'socket.io-client';

function createCanvas( width: number, height: number ) {
	return document.body.appendChild(
		Object.assign( document.createElement( 'canvas' ), { width, height } )
	) as HTMLCanvasElement;
}

const width = 960,
	height = 800,
	canvas = {
		'2d': new Canvas2D( createCanvas( width, height ) ),
		'3d': new Canvas3D( createCanvas( width, height ) )
	};

( () => {
	let board = new Board( 0, 0 );
	let turn = 0;
	let isGameOver = true;
	const rules = new Rules;
	const { c2d } = canvas[ '2d' ];
	const socket = io.connect( '/' );

	for( let evt of [ 'connect', 'update' ] ) {
		socket.on( evt, console.log.bind( console, evt ) ); 
	}

	for( let evt of [ 'error', 'connect_error', 'reconnect_error' ] ) {
		socket.on( evt, console.error.bind( console, evt ) ); 
	}

	socket.on( 'update', data => {
		board = Board.deserialize( data.board );
		turn = data.turn;
		isGameOver = data.isGameOver;
	} );

	function makeMove( position: Point ) {
		socket.emit( 'move', { position } );
	}

	function newGame() {
		socket.emit( 'newgame' );
	}

	let selectedSquare: Square|null = null;
	function render( time: number ) {
		c2d.save();
		canvas[ '2d' ].clear();

		c2d.fillStyle = '#6c6';
		c2d.fillRect( board.bounds.left, board.bounds.top, board.bounds.width, board.bounds.height );
		c2d.strokeStyle = 'black';
		for( const { enabled, color, position: { x, y }, bounds: { left, top, width, height, center } } of board ) {
			if( !enabled ) { continue; }
			c2d.save();
			c2d.lineWidth = 1;
			c2d.fillStyle = '#8c8';
			c2d.fillRect( left, top, width, height );
			c2d.strokeRect( left, top, width, height );

			if( color !== null ) {
				c2d.lineWidth = 1;
				c2d.fillStyle = color === 0 ? '#222' : '#ddd';
				c2d.beginPath();
				c2d.ellipse( center.x, center.y, width * .4, height * .4, 0, 0, Math.PI * 2 );
				c2d.fill();
				c2d.stroke();
			}

			if( rules.isValid( board, { x, y }, turn ) ) {
				c2d.lineWidth = 8;
				c2d.strokeStyle = turn === 0 ? '#222' : '#ddd';
				c2d.beginPath();
				c2d.moveTo( center.x - width * .25, center.y - height * .25 );
				c2d.lineTo( center.x + width * .25, center.y + height * .25 );
				c2d.moveTo( center.x + width * .25, center.y - height * .25 );
				c2d.lineTo( center.x - width * .25, center.y + height * .25 );
				c2d.stroke();
			}

			c2d.restore();
		}

		const lineHeight = 16,
			lines = [] as string[];
		if( isGameOver ) {
			lines.push( 'Game Over' );
		} else {
			lines.push( `${turn === 0 ? 'Black' : 'White'}'s turn` );
		}
		if( board ) {
			lines.push( `Black: ${rules.getScore(board,0)}` );
			lines.push( `White: ${rules.getScore(board,1)}` );
		}

		c2d.save();
		c2d.font = 'bold 16px sans-serif';
		c2d.textBaseline = 'bottom';
		c2d.textAlign = 'left';
		c2d.shadowBlur = 5;
		c2d.shadowColor = 'white';
		c2d.fillStyle = 'black';
		let top = lineHeight;
		for( const line of lines ) {
			c2d.fillText( line, board.bounds.right, top );
			top += lineHeight;
		}
		c2d.restore();

		c2d.restore();
		requestAnimationFrame( render );
	}
	requestAnimationFrame( render );

	function onMouseMove( { clientX, clientY }: { clientX: number, clientY: number } ) {
		const { x, y } = canvas[ '2d' ].screenToCanvas( { x: clientX, y: clientY } );
		selectedSquare = board.hitTest( { x, y } );
		document.documentElement.style.cursor = selectedSquare && rules.isValid( board, selectedSquare.position, turn ) ? 'pointer' : null;
	}

	function onClick( { clientX, clientY }: { clientX: number, clientY: number } ) {
		if( isGameOver ) {
			newGame();
			return;
		}

		const { x, y } = canvas[ '2d' ].screenToCanvas( { x: clientX, y: clientY } ),
			square = board.hitTest( { x, y } );
		if( square ) {
			makeMove( square.position );
		}
	}

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'click', onClick, false );
	document.addEventListener( 'touchstart', e => {
		for( const touch of Array.from( e.touches ) ) {
			onClick( touch );
		}
	}, false );
} )();
