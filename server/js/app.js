const express = require( 'express' ),
	{ NODE_PORT = 3000, NODE_IP = 'localhost' } = process.env,
	app = express(),
	ws = express.Router(); // eslint-disable-line new-cap
require( 'express-ws' )( app );

app.get( '/health', ( req, res ) => {
	res.writeHead( 200 );
	res.end();
} );


const { default: Board } = require( './shared/board' ),
	{ default: Rules } = require( './shared/rules' );
const board = new Board( 8, 8 ),
	rules = new Rules;
let turn;
function newGame() {
	turn = 0;
	board.reset();
	board.get( { x: 3, y: 3 } ).color = 0;
	board.get( { x: 4, y: 3 } ).color = 1;
	board.get( { x: 3, y: 4 } ).color = 1;
	board.get( { x: 4, y: 4 } ).color = 0;
}
newGame();

function nextTurn() {
	if( rules.isGameOver( board, [ 0, 1 ] ) ) { return; }
	turn = ( turn + 1 ) % 2;
	if( rules.getValidMoves( board, turn ).length === 0 ) {
		nextTurn();
	}
}

ws.ws( '/game', ( ws, req ) => {
	console.log( 'Client connected' );
	ws.on( 'message', msg => {
		const data = JSON.parse( msg );
		switch( data.type ) {
		case 'move':
			if( rules.makeMove( board, data.position, turn ) ) {
				nextTurn();
			}
			break;
		case 'newgame':
			newGame();
			break;
		}
		const out = JSON.stringify( {
			board: board.serialize(),
			turn,
			isGameOver: rules.isGameOver( board, [ 0, 1 ] )
		} );
		ws.send( out );
	} );
} );

app.use( express.static( 'client' ) );

app.use( '/ws', ws );

app.listen( NODE_PORT, NODE_IP, () => {
	console.log( `Application worker ${process.pid} started...` );
} );
