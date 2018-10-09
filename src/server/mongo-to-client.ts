import { m2sGame, m2sRoom, m2sRoomSession, m2sGameState, m2sSession } from './mongo-to-server';
import { s2cGame, s2cRoom, s2cRoomSession, s2cGameState, s2cSession } from './server-to-client';

export function m2cGame( game: MongoGame ): ClientGame {
	return s2cGame( m2sGame( game ) );
}

export function m2cRoom( room: MongoRoom ): ClientRoom {
	return s2cRoom( m2sRoom( room ) );
}

export function m2cRoomSession( roomSession: MongoRoomSession ): ClientRoomSession {
	return s2cRoomSession( m2sRoomSession( roomSession ) );
}

export function m2cGameState( gameState: MongoGameState ): ClientGameState {
	return s2cGameState( m2sGameState( gameState ) );
}

export function m2cSession( session: MongoSession ): ClientSession {
	return s2cSession( m2sSession( session ) );
}
