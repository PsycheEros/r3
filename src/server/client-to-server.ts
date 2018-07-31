import { uuid } from './uuid';

export function c2sGame( { id, ruleSet, colors, gameStates }: ClientGame ): ServerGame {
	return { _id: uuid( id ), ruleSet, colors: [ ...colors ], gameStates: gameStates.map( c2sGameState ) };
}

export function c2sGameState( { time, turn, size, lastMove, data }: ClientGameState ): ServerGameState {
	return { time: new Date( time ), turn, size: { ...size }, lastMove: lastMove ? { ...lastMove } : null, data: [ ...data ] };
}
