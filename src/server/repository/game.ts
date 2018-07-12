import { MapRepository } from 'server/repository/map';

export class GameRepository extends MapRepository<GameRecord> {
	public constructor() {
		super( 'gameId' );
	}
}
