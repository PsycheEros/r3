import { Int32 } from 'bson';

export function s2mExpiration( { _id, expires }: ServerExpiration ): MongoExpiration {
	return { _id, expires };
}

export function s2mGame( { _id, colors, ruleSet, gameStates }: ServerGame ): MongoGame {
	return { _id, colors: [ ...colors ], ruleSet, gameStates: gameStates.map( s2mGameState ) };
}

export function s2mRoom( { _id, name, passwordHash, gameId }: ServerRoom ): MongoRoom {
	return { _id, name, passwordHash, gameId };
}

export function s2mRoomSession( { roomId, sessionId, seats }: ServerRoomSession ): MongoRoomSession {
	return { roomId, sessionId, seats: [ ...seats ] };
}

export function s2mGameState( { time, turn, lastMove, size, data }: ServerGameState ): MongoGameState {
	return {
		time,
		turn: turn == null ? null : new Int32( turn ),
		lastMove: lastMove ? {
			x: new Int32( lastMove.x ),
			y: new Int32( lastMove.y )
		} : null,
		size: {
			width: new Int32( size.width ),
			height: new Int32( size.height )
		},
		data: data.map( d => ( typeof d === 'number' ) ? new Int32( d ) : d )
	};
}

export function s2mSession( { _id, nick, token, userId }: ServerSession ): MongoSession {
	return { _id, nick, token, userId };
}

export function s2mUser( { _id, nick, passwordHash, roles }: ServerUser ): MongoUser {
	return { _id, nick, passwordHash, roles };
}
