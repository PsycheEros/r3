import { s2mGameState } from './server-to-mongo';
import { c2sGameState } from './client-to-server';

export function c2mGameState( gameState: ClientGameState ): MongoGameState {
	return s2mGameState( c2sGameState( gameState ) );
}
