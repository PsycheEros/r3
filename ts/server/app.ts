const { NODE_PORT = 3000, NODE_IP = 'localhost',
		OPENSHIFT_REDIS_HOST,
		OPENSHIFT_REDIS_PASSWORD,
		OPENSHIFT_REDIS_PORT
	} = process.env;
import GameState from '../shared/game-state';
import Board from '../shared/board';
import Rules from '../shared/rules';
import express = require( 'express' );
const app = express();
import index = require( 'serve-index' );
const server = require( 'http' ).Server( app ),
	io = require( 'socket.io' )( server ),
	rules = new Rules,
	gameState = new GameState;

if( OPENSHIFT_REDIS_HOST ) {
	const redis = require( 'redis' ).createClient,
		adapter = require( 'socket.io-redis' ),
		pub = redis( OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, { auth_pass: OPENSHIFT_REDIS_PASSWORD } ),
		sub = redis( OPENSHIFT_REDIS_PORT, OPENSHIFT_REDIS_HOST, { return_buffers: true, auth_pass: OPENSHIFT_REDIS_PASSWORD } );

	io.adapter( adapter( { pubClient: pub, subClient: sub } ) );
}

app.use( require( 'body-parser' ).json() );

app.get( '/health', ( req, res ) => {
	res.writeHead( 200 );
	res.end();
} );

function flushUpdate( target = io ) {
	target.emit( 'update', gameState.serialize() );
}

function newGame() {
	const { board } = gameState;
	if( !rules.isGameOver( board ) ) return false;
	statusMessage( 'New game' );
	rules.reset( gameState );
	flushUpdate();
	return true;
}
newGame();

function makeMove( position, color ) {
	const { board, turn } = gameState;
	if( color !== turn ) return false;
	if( !rules.makeMove( gameState, position ) ) return false;
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
		makeMove( position, gameState.turn );
	} );

	socket.on( 'newgame', () => {
		newGame();
	} );

	socket.on( 'message', ( { user, message } ) => {
		chatMessage( user, message );
	} );

	flushUpdate( socket );
} );

/*
app.use( ( req, res, next ) => {
	console.log( req.method, req.url );
	next();
} );
*/

app.use( express.static( 'client' ) );
app.use( index( 'client' ) );

app.use( '/lib', express.static( 'node_modules' ) );
app.use( '/lib', index( 'node_modules' ) );

server.listen( NODE_PORT, NODE_IP, () => {
	console.log( `Application worker ${process.pid} started...` );
} );