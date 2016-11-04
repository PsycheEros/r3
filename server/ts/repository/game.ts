import MapRepository from './map';

export default class GameRepository extends MapRepository<GameRecord> {
	public constructor() {
		super( 'gameId' );
	}
}
