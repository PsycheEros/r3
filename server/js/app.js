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

app.use( require( 'body-parser' ).json() );

app.get( '/health', ( req, res ) => {
	res.writeHead( 200 );
	res.end();
} );

const { default: Board } = require( './shared/board' ),
	{ default: Rules } = require( './shared/rules' ),
	rules = new Rules;
let board = new Board( 8, 8 ),
	turn;

function flushUpdate( target = io ) {
	target.emit( 'update', {
		board: board.serialize(),
		turn,
		isGameOver: rules.isGameOver( board )
	} );
}

function newGame() {
	if( !rules.isGameOver( board ) ) return false;
	statusMessage( 'New game' );
	turn = 0;
	board.reset();
	board.get( { x: 3, y: 3 } ).color = 0;
	board.get( { x: 4, y: 3 } ).color = 1;
	board.get( { x: 3, y: 4 } ).color = 1;
	board.get( { x: 4, y: 4 } ).color = 0;
	flushUpdate();
	return true;
}
newGame();

function makeMove( position, color ) {
	if( color !== turn ) return false;
	if( !rules.makeMove( board, position, color ) ) return false;
	if( rules.isGameOver( board ) ) {
		const black = rules.getScore( board, 0 ),
			white = rules.getScore( board, 1 );
		if( black > white ) {
			statusMessage( `Black wins ${black}:${white}` );
		} else if( white > black ) {
			statusMessage( `White wins ${white}:${black}` );
		} else {
			statusMessage( 'Draw game' );
		}
	} else {
		( function nextTurn() {
			turn = ( turn + 1 ) % 2;
			if( rules.getValidMoves( board, turn ).length === 0 ) {
				nextTurn();
			}
		}() );
	}
	flushUpdate();
	return true;
}

function statusMessage( message ) {
	console.log( message );
	io.emit( 'message', { message } );
	return true;
}

function chatMessage( user, message ) {
	io.emit( 'message', { user, message } );
	return true;
}

let connections = 0;
io.on( 'connection', socket => {
	statusMessage( `User connected, ${++connections} connected` );

	socket.on( 'disconnect', () => {
		statusMessage( `User disconnected, ${--connections} connected` );
	} );

	socket.on( 'move', ( { position } ) => {
		makeMove( position, turn );
	} );

	socket.on( 'newgame', () => {
		newGame();
	} );

	socket.on( 'message', ( { user, message } ) => {
		chatMessage( user, message );
	} );

	flushUpdate( socket );
} );

app.use( ( req, res, next ) => {
	console.log( req.method, req.url );
	next();
} );

app.use( express.static( 'client' ) );

app.use( '/lib', express.static( 'node_modules' ) );

server.listen( NODE_PORT, NODE_IP, () => {
	console.log( `Application worker ${process.pid} started...` );
} );
