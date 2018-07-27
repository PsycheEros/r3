export function s2cRoom( { _id: id, name, passwordHash, gameId }: ServerRoom ): ClientRoom {
	return { id, name, hasPassword: !!passwordHash, gameId: gameId || null };
}

export function s2cGame( { _id: id, colors, ruleSet, gameStates }: ServerGame ): ClientGame {
	return { id, colors: [ ...colors ], ruleSet, gameStates: gameStates.map( s2cGameState ) };
}

export function s2cGameState( { time, turn, lastMove, size, data }: ServerGameState ): ClientGameState {
	return { time, turn, lastMove, size, data: [ ...data ] };
}

export function s2cRoomSession( { roomId, sessionId, seats }: ServerRoomSession ) {
	return { roomId, sessionId, seats: [ ...seats ] };
}

export function s2cSession( { _id: id, nick }: ServerSession ) {
	return { id, nick };
}
