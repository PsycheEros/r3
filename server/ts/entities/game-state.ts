import { Table, Index, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { GameEntity } from './game';

@Table( 'GameState' )
export class GameStateEntity {
	@PrimaryColumn( { name: 'GameStateID' } )
	public gameStateId: string;

	@Column( { name: 'GameID' } )
	public gameId: string;

	@Column( { name: 'Turn' } )
	public turn: number;

	@ManyToOne( type => GameEntity, game => game.gameStates )
	public game: GameEntity;
}
