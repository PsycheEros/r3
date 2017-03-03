import { MapRepository } from './map';

export class GameStateRepository extends MapRepository<GameStateRecord> {
	public constructor() {
		super( 'gameStateId' );
	}
}
