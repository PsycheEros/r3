import { MapRepository } from 'server/repository/map';

export class GameStateRepository extends MapRepository<GameStateRecord> {
	public constructor() {
		super( 'gameStateId' );
	}
}
