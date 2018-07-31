import { uuidStr } from './uuid';

export function s2cRoom( { _id, name, passwordHash, gameId }: ServerRoom ): ClientRoom {
	return { id: uuidStr( _id ), name, hasPassword: !!uuidStr( passwordHash ), gameId: uuidStr( gameId ) };
}

export function s2cGame( { _id, colors, ruleSet, gameStates }: ServerGame ): ClientGame {
	return { id: uuidStr( _id ), colors: [ ...colors ], ruleSet, gameStates: gameStates.map( s2cGameState ) };
}

export function s2cGameState( { time, turn, lastMove, size, data }: ServerGameState ): ClientGameState {
	return { time: time.toISOString(), turn, lastMove, size, data: [ ...data ] };
}

export function s2cRoomSession( { roomId, sessionId, seats }: ServerRoomSession ) {
	return { roomId: uuidStr( roomId ), sessionId: uuidStr( sessionId ), seats: [ ...seats ] };
}

export function s2cSession( { _id, nick }: ServerSession ) {
	return { id: uuidStr( _id ), nick };
}
