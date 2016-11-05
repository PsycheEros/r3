import { Table, Index, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { GameEntity } from './game';

@Table( 'GameState' )
export class GameStateEntity {
	@PrimaryColumn()
	public gameStateId: string;

	@Column()
	public gameId: string;

	@Column()
	public turn: number;

	@ManyToOne( type => GameEntity, game => game.gameStates )
	public game: GameEntity;
}
