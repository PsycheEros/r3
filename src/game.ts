import { GameState } from './game-state';
import { ruleSetMap } from './rule-sets';

export class Game {
	public constructor( public readonly gameId: string ) {}

	public get currentGameState() {
		const { gameStates } = this,
			{ length } = gameStates;
		if( length > 0 ) return gameStates[ length - 1 ];
		else return null;
	}

	public colors: string[];
	public gameStates = [] as GameState[];
	public rules: Rules;

	public serialize(): SerializedGame {
		const { gameId, colors, gameStates, rules } = this;
		return {
			gameId,
			colors: [ ...colors ],
			gameStates: gameStates.map( gs => gs.serialize() ),
			ruleSet: rules.ruleSet
		};
	}

	public static deserialize( { gameId, colors, gameStates, ruleSet }: SerializedGame ) {
		const game = new Game( gameId );
		game.rules = ruleSetMap.get( ruleSet );
		game.colors = [ ...colors ];
		game.gameStates = gameStates.map( gameState => GameState.deserialize( gameState ) );
		return game;
	}

	public clone() {
		return Game.deserialize( this.serialize() );
	}
}
