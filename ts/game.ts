import GameState from './game-state';
import Rules from './rules';

export default class Game {
	public readonly colors = [] as number[];

	public get currentGameState() {
		const { gameStates } = this,
			{ length } = gameStates;
		if( length > 0 ) return gameStates[ length - 1 ];
		else return null;
	}

	public readonly gameStates = [] as GameState[];

	public serialize(): SerializedGame {
		const { colors, gameStates } = this;
		return {
			colors: Array.from( colors ),
			gameStates: Array.from( gameStates, gameState => gameState.serialize() )
		};
	}

	public deserialize( game: SerializedGame ) {
		const { colors, gameStates } = this;
		colors.splice( 0, colors.length, ...game.colors );
		gameStates.splice( 0, gameStates.length, ...game.gameStates.map( gameState => GameState.deserialize( gameState ) ) );
		return this;
	}

	public static deserialize( game: SerializedGame ) {
		return ( new Game ).deserialize( game );
	}

	public clone() {
		return Game.deserialize( this.serialize() );
	}
}
