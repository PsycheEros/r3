import { MapRepository } from './map';

export class GameRepository extends MapRepository<GameRecord> {
	public constructor() {
		super( 'gameId' );
	}
}
