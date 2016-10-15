const { NODE_PORT = 3000, NODE_IP = 'localhost',
		OPENSHIFT_REDIS_HOST,
		OPENSHIFT_REDIS_PASSWORD,
		OPENSHIFT_REDIS_PORT
	} = process.env,
	express = require( 'express' ),
	app = express(),
	server = require( 'http' ).Server( app ),
	io = require( 'socket.io' )( server );

if( OPENSHIFT_REDIS_HOST ) {
	const redis = require( 'redis' ).createClient,
		adapter = require( 'socket.io-redis' ),
		pub = redis( OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, { auth_pass: OPENSHIFT_REDIS_PASSWORD } );
		sub = redis( OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, { return_buffers: true, auth_pass: OPENSHIFT_REDIS_PASSWORD } );

	io.adapter( adapter( { pubClient: pub, subClient: sub } ) );
}

app.get( '/health', ( req, res ) => {
	res.writeHead( 200 );
	res.end();
} );

const { default: Board } = require( './shared/board' ),
	{ default: Rules } = require( './shared/rules' )
	board = new Board( 8, 8 ),
	rules = new Rules;
let turn;

function flushUpdate( target = io ) {
	target.emit( 'update', {
		board: board.serialize(),
		turn,
		isGameOver: rules.isGameOver( board, [ 0, 1 ] )
	} );	
}

function newGame() {
	turn = 0;
	board.reset();
	board.get( { x: 3, y: 3 } ).color = 0;
	board.get( { x: 4, y: 3 } ).color = 1;
	board.get( { x: 3, y: 4 } ).color = 1;
	board.get( { x: 4, y: 4 } ).color = 0;
	flushUpdate();
}
newGame();

function nextTurn() {
	if( rules.isGameOver( board, [ 0, 1 ] ) ) { return; }
	turn = ( turn + 1 ) % 2;
	if( rules.getValidMoves( board, turn ).length === 0 ) {
		nextTurn();
	}
	flushUpdate();
}

io.on( 'connection', socket => {
	console.log( 'Client connected' );

	socket.on( 'move', data => {
		if( !rules.makeMove( board, data.position, turn ) ) return;
		nextTurn();
	} );

	socket.on( 'newgame', () => {
		if( !rules.isGameOver( board, [ 0, 1 ] ) ) return;
		newGame();
	} );

	socket.on( 'disconnect', () => {
		console.log( 'Client disconnected' );
	} );

	flushUpdate( socket );
} );

app.use( express.static( 'client' ) );

app.use( '/lib', express.static( 'node_modules' ) );

server.listen( NODE_PORT, NODE_IP, () => {
	console.log( `Application worker ${process.pid} started...` );
} );
