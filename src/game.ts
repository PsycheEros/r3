import { GameState } from 'src/game-state';

export class Game {
	public constructor( public readonly gameId: string ) {}

	public get currentGameState() {
		const { gameStates } = this,
			{ length } = gameStates;
		if( length > 0 ) return gameStates[ length - 1 ];
		else return null;
	}

	public colors = [] as number[];
	public gameStates = [] as GameState[];

	public serialize(): SerializedGame {
		const { gameId, colors, gameStates } = this;
		return {
			gameId,
			colors: Array.from( colors ),
			gameStates: Array.from( gameStates, gameState => gameState.serialize() )
		};
	}

	public static deserialize( { gameId, colors, gameStates }: SerializedGame ) {
		const game = new Game( gameId );
		game.colors.splice( 0, game.colors.length, ...colors );
		game.gameStates.splice( 0, game.gameStates.length, ...gameStates.map( gameState => GameState.deserialize( gameState ) ) );
		return game;
	}

	public clone() {
		return Game.deserialize( this.serialize() );
	}
}
