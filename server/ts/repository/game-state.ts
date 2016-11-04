import MapRepository from './map';

export default class GameStateRepository extends MapRepository<GameStateRecord> {
	public constructor() {
		super( 'gameStateId' );
	}
}
