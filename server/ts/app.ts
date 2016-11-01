import 'source-map-support/register';
import 'core-js';
const { NODE_PORT = 3000, NODE_IP = 'localhost',
		OPENSHIFT_REDIS_HOST,
		OPENSHIFT_REDIS_PASSWORD,
		OPENSHIFT_REDIS_PORT
	} = process.env;
import uuid = require( 'uuid' );

import GameRepository from './game-repository';
import RoomRepository from './room-repository';
import Game from './game';
import GameState from './game-state';
import Board from './board';
import Rules from './rules';
import express = require( 'express' );
const app = express();
import index = require( 'serve-index' );
const server = require( 'http' ).Server( app ),
	io = require( 'socket.io' )( server ) as SocketIO.Server,
	rules = new Rules;

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

type Session = {
	socket: SocketIO.Client
};

const roomRepository = new RoomRepository,
	gameRepository = new GameRepository;

function isValidUsername( username: string ) {
	if( !username ) return false;
	return /^[_a-z][-_a-z0-9]+[_a-z0-9]+/i.test( username );
}

function usersInRoom( roomId: string ): number {
	const room = io.nsps[ '/' ].adapter.rooms[ roomId ];
	if( !room ) return 0;
	return Object.keys( room.sockets ).length;
}

async function cleanupRooms() {
	let removed = 0;
	for( const room of await roomRepository.listAll() ) {
		const { roomId } = room;
		if( usersInRoom( roomId ) <= 0 ) {
			console.log( `Deleting room ${roomId}...` );
			await roomRepository.delete( roomId );
			await gameRepository.delete( room.gameId );
			++removed;
		}
	}
	if( removed ) {
		flushRooms();
	}
}

async function flushRooms( target: SocketIO.Socket|SocketIO.Server = io ) {
	target.emit( 'rooms', await roomRepository.listAll() );
}

async function flushUpdate( room: Room, socket?: SocketIO.Socket ) {
	const game = await gameRepository.read( room.gameId );
	if( !game ) return;
	if( socket ) {
		socket.emit( 'update', game.serialize() );
	} else {
		io.to( room.roomId ).emit( 'update', game.serialize() );
	}
}

async function newGame( room: Room ) {
	let game = await gameRepository.read( room.gameId );
	if( game ) {
		const { currentGameState: gameState } = game,
			{ board } = gameState!;
		if( !rules.isGameOver( board ) ) throw new Error( 'Game is not over.' );
	}
	statusMessage( room.roomId, 'New game' );
	const gameId = uuid.v4();
	game = rules.newGame( gameId );
	room.gameId = gameId;
	await gameRepository.create( game );
	flushRooms();
	flushUpdate( room );
	return game;
}

async function createRoom( name: string ) {
	const roomId = uuid.v4(),
		room = { roomId, gameId: null as any, name } as Room,
		game = await newGame( room );
	room.gameId = game!.gameId;
	await roomRepository.create( room );
	await flushRooms();
	return room;
}

async function destroyRoom( roomId: string ) {
	await gameRepository.delete( roomId );
	await flushRooms();
}

async function makeMove( room: Room, position: Point ) {
	const game = await gameRepository.read( room.gameId );
	if( !game ) return;
	if( !rules.makeMove( game, position ) ) return;
	const { roomId } = room,
		{ currentGameState: gameState } = game,
		{ board } = gameState!;
	if( rules.isGameOver( board ) ) {
		const black = rules.getScore( board, 0 ),
			white = rules.getScore( board, 1 );
		if( black > white ) {
			await statusMessage( roomId, `Black wins ${black}:${white}` );
		} else if( white > black ) {
			await statusMessage( roomId, `White wins ${white}:${black}` );
		} else {
			await statusMessage( roomId, 'Draw game' );
		}
	}
	await flushUpdate( room );
	return true;
}


function statusMessage( roomId: string, message: string, socket?: SocketIO.Socket ) {
	if( socket ) {
		socket.emit( 'message', { roomId, message } );
	} else {
		io.to( roomId ).emit( 'message', { roomId, message } );
	}
	return true;
}

function chatMessage( roomId: string, user: string, message: string ) {
	io.to( roomId ).emit( 'message', { roomId, user, message } );
	return true;
}

let connections = 0;
io.on( 'connection', ( socket: SocketIO.Socket ) => {
	function flushJoinedRooms() {
		socket.emit( 'joinedRooms',
			Object.values( socket.rooms ).slice( 1 )
		); 
	}
	
	function getValue( key: string ) {
		return socket[ key ];
	}

	function setValue( key: string, value: any ) {
		socket[ key ] = value;
	}

	async function leaveRoom( roomId: string ) {
		await new Promise( ( resolve, reject ) => {
			socket.leave( roomId, err => {
				if( err ) {
					reject( err );
				} else {
					resolve();
				}
			} );
		} );
		const username = getValue( 'username' );
		await flushJoinedRooms();
		await statusMessage( roomId, `${username} has left the room.` );
	}

	const commands = {
		async help( roomId: string ) {
			await statusMessage( roomId, `Available commands:
/?
/help
/nick <username>
/quit
`, socket );
		},
		async '?'( roomId: string ) {
			await commands.help( roomId );
		},
		async nick( roomId: string, username: string ) {
			if( !isValidUsername( username ) ) {
				throw new Error( 'Invalid username.' );
			}
			const previousUsername = getValue( 'username' );
			setValue( 'username', username );
			await statusMessage( roomId, `${previousUsername} is now known as ${username}.` );
		},
		async quit( roomId: string ) {
			await leaveRoom( roomId );
		}
	};
	async function command( roomId: string, raw: string ) {
		const [ cmd, ...params ] = raw.trim().split( /\s+/g );
		try {
			if( !commands.hasOwnProperty( cmd ) ) {
				throw new Error( 'Unknown command.' );
			}
			await commands[ cmd ]( roomId, ...params );
		} catch( ex ) {
			if( ex && ex.message ) {
				await statusMessage( roomId, ex.message );
			}
			throw ex;
		}
	}

	setValue( 'username', 'Guest' );

	console.log( `User connected, ${++connections} connected` );

	socket.on( 'disconnecting', () => {
		const username = getValue( 'username' );
		for( const roomId of Object.values( socket.rooms ) ) {
			statusMessage( roomId, `${username} has disconnected.` );
		}
	} );

	socket.on( 'disconnect', () => {
		setTimeout( () => { cleanupRooms(); }, 0 );
		console.log( `User disconnected, ${--connections} connected` );
	} );

	socket.on( 'makeMove', async ( { roomId, position }, callback ) => {
		try {
			const room = await roomRepository.read( roomId );
			if( !room ) {
				throw new Error( 'Room not found.' );
			}
			if( !await makeMove( room, position ) ) {
				throw new Error( 'Failed to make move.' );
			}
			callback( null, {} );
		} catch( ex ) {
			console.error( ex );
			callback( ex.message || ex, null );
		}
	} );

	socket.on( 'newGame', async ( { roomId }, callback ) => {
		try {
			const room = await roomRepository.read( roomId );
			if( !room ) {
				throw new Error( 'Room not found.' );
			}
			const game = await newGame( room );
			if( !game ) {
				throw new Error( 'Failed to create game.' );
			}
			callback( null, { game: game.serialize() } );
		} catch( ex ) {
			console.error( ex );
			callback( ex.message || ex, null );
		}
	} );

	socket.on( 'sendMessage', async ( { roomId, message }, callback ) => {
		try {
			if( message.startsWith( '/' ) ) {
				await command( roomId, message.slice( 1 ) );
				callback( null, {} );
				return;
			}
			const username = getValue( 'username' );
			if( !await chatMessage( roomId, username, message ) ) {
				throw new Error( 'Failed to send message.' );
			}
			callback( null, {} );
		} catch( ex ) {
			console.error( ex );
			callback( ex.message || ex, null );
		}
	} );

	socket.on( 'createRoom', async ( { name }, callback ) => {
		try {
			const room = await createRoom( name );
			callback( null, room );
		} catch( ex ) {
			console.error( ex );
			callback( ex.message || ex, null );
		}
	} );

	socket.on( 'joinRoom', async ( { roomId }, callback ) => {
		try {
			const room = await roomRepository.read( roomId );
			if( !room ) {
				throw new Error( 'Failed to join room.' );
			}
			const username = getValue( 'username' );
			await new Promise( ( resolve, reject ) => {
				socket.join( room.roomId, err => {
					if( err ) { reject( err ); }
					else { resolve(); }
				} );
			} );
			await flushJoinedRooms();
			await flushUpdate( room, socket );
			await statusMessage( roomId, `${username} has joined the room.` );
			callback( null, { room } );
		} catch( ex ) {
			console.error( ex );
			callback( ex.message || ex, null );
		}
	} );

	socket.on( 'leaveRoom', async ( { roomId }, callback ) => {
		try {
			await leaveRoom( roomId );
			callback( null, {} );
		} catch( ex ) {
			console.error( ex );
			callback( ex.message || ex, null );
		}
		setTimeout( () => { cleanupRooms(); }, 0 );
	} );

	flushRooms( socket );
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
