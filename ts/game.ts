import GameState from './game-state';
import Rules from './rules';

export default class Game {
	public readonly colors = [] as number[];

	public readonly gameStates = [] as GameState[];
}
