export function s2cRoom( { _id, name, passwordHash, gameId }: ServerRoom ): ClientRoom {
	return { id: _id, name, hasPassword: !!passwordHash, gameId: gameId || null };
}

export function s2cGame( { _id, colors, ruleSet, gameStates }: ServerGame ): ClientGame {
	return { id: _id, colors: [ ...colors ], ruleSet, gameStates: gameStates.map( s2cGameState ) };
}

export function s2cGameState( { time, turn, lastMove, size, mask, data }: ServerGameState ): ClientGameState {
	return { time, turn, lastMove, size, mask: [ ...mask ], data: [ ...data ] };
}
