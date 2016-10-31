import Game from './game';
import Repository from './repository';

export default class GameRepository extends Repository<Game> {
	public constructor() {
		super( 'gameId' );
	}
}
