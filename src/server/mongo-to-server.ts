import { Int32 } from 'bson';

export function m2sExpiration( { _id, expires }: MongoExpiration ): ServerExpiration {
	return { _id, expires };
}

export function m2sGame( { _id, colors, ruleSet, gameStates }: MongoGame ): ServerGame {
	return { _id, colors: [ ...colors ], ruleSet, gameStates: gameStates.map( m2sGameState ) };
}

export function m2sRoom( { _id, name, passwordHash, gameId }: MongoRoom ): ServerRoom {
	return { _id, name, passwordHash, gameId };
}

export function m2sRoomSession( { roomId, sessionId, seats }: MongoRoomSession ): ServerRoomSession {
	return { roomId, sessionId, seats: seats.map( s => s.valueOf() ) };
}

export function m2sGameState( { time, turn, lastMove, size, data }: MongoGameState ): ServerGameState {
	return {
		time,
		turn: turn == null ? null : turn.valueOf(),
		lastMove: lastMove ? {
			x: lastMove.x.valueOf(),
			y: lastMove.y.valueOf()
		} : null,
		size: {
			width: size.width.valueOf(),
			height: size.height.valueOf()
		},
		data: data.map( d => d.valueOf() )
	};
}

export function m2sSession( { _id, nick, token, userId }: MongoSession ): ServerSession {
	return { _id, nick, token, userId };
}

export function m2sUser( { _id, nick, passwordHash, roles }: MongoUser ): ServerUser {
	return { _id, nick, passwordHash, roles };
}
