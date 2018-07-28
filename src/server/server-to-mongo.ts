import { Int32, Long } from 'bson';

export function s2mExpiration( { _id, expires }: ServerExpiration ): object {
	return { _id, expires: Long.fromNumber( expires ) };
}

export function s2mGame( { _id, colors, ruleSet, gameStates }: ServerGame ): object {
	return { _id, colors: [ ...colors ], ruleSet, gameStates: gameStates.map( s2mGameState ) };
}

export function s2mRoom( { _id, name, passwordHash, gameId }: ServerRoom ): object {
	return { _id, name, passwordHash, gameId };
}

export function s2mRoomSession( { roomId, sessionId, seats }: ServerRoomSession ): object {
	return { roomId, sessionId, seats: [ ...seats ] };
}

export function s2mGameState( { time, turn, lastMove, size, data }: ServerGameState ) {
	return {
		time: Long.fromNumber( time ),
		turn: new Int32( turn ),
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

export function s2mSession( { _id, nick, token }: ServerSession ): object {
	return { _id, nick, token };
}

export function s2mUser( { _id, nick, passwordHash, roles }: ServerUser ): object {
	return { _id, nick, passwordHash, roles };
}
