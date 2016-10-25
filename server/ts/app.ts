import 'source-map-support/register';
const { NODE_PORT = 3000, NODE_IP = 'localhost',
		OPENSHIFT_REDIS_HOST,
		OPENSHIFT_REDIS_PASSWORD,
		OPENSHIFT_REDIS_PORT
	} = process.env;
import Game from './game';
import GameState from './game-state';
import Board from './board';
import Rules from './rules';
import express = require( 'express' );
const app = express();
import index = require( 'serve-index' );
const server = require( 'http' ).Server( app ),
	io = require( 'socket.io' )( server ),
	rules = new Rules;
let game: Game;

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

const rooms = [] as Room[];
const roomsById = new Map<number, Room>();
const gamesById = new Map<number, Game>();

function flushUpdate( roomId: number, target = io ) {
	const room = roomsById.get( roomId );
	if( !room ) return;
	const game = gamesById.get( room.gameId );
	if( !game ) return;
	target.emit( 'update', game.serialize() );
}

let nextGameId = 0;
function newGame( room: Room ) {
	let game = gamesById.get( room.gameId );
	if( game ) {
		const { currentGameState: gameState } = game,
			{ board } = gameState!;
		if( !rules.isGameOver( board ) ) return null;
	}
	statusMessage( room.roomId, 'New game' );
	const gameId = nextGameId++;
	game = rules.newGame( gameId );
	gamesById.set( gameId, game );
	flushUpdate( room.roomId );
	return gameId;
}

let nextRoomId = 0;
function newRoom( name: string ) {
	const roomId = nextRoomId++,
		room = { roomId, gameId: null as any, name } as Room;
	room.gameId = newGame( room )!;
	rooms.push( room );
}

function makeMove( roomId: number, position: Point ) {
	const room = roomsById.get( roomId );
	if( !room ) return;
	const game = gamesById.get( room.gameId );
	if( !game ) return;
	if( !rules.makeMove( game, position ) ) return;
	const { currentGameState: gameState } = game,
		{ board } = gameState!;
	if( rules.isGameOver( board ) ) {
		const black = rules.getScore( board, 0 ),
			white = rules.getScore( board, 1 );
		if( black > white ) {
			statusMessage( roomId, `Black wins ${black}:${white}` );
		} else if( white > black ) {
			statusMessage( roomId, `White wins ${white}:${black}` );
		} else {
			statusMessage( roomId, 'Draw game' );
		}
	}
	flushUpdate( roomId );
	return true;
}

function statusMessage( roomId: number, message ) {
	console.log( message );
	io.emit( 'message', { roomId, message } );
	return true;
}

function chatMessage( roomId: number, user: string, message: string ) {
	io.emit( 'message', { roomId, user, message } );
	return true;
}

let connections = 0;
io.on( 'connection', socket => {
	console.log( `User connected, ${++connections} connected` );

	socket.on( 'disconnect', () => {
		console.log( `User disconnected, ${--connections} connected` );
	} );

	socket.on( 'makeMove', ( { gameId, position } ) => {
		makeMove( gameId, position );
	} );

	socket.on( 'newGame', ( { roomId } ) => {
		newGame( roomId );
	} );

	socket.on( 'sendMessage', ( { roomId, user, message } ) => {
		chatMessage( roomId, user, message );
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
