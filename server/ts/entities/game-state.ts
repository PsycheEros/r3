import { Table, Index, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { GameEntity } from './game';

@Table()
export class GameStateEntity {
	@PrimaryColumn( { length: '36' } )
	public gameStateId: string;

	@Column( { length: '36' } )
	public gameId: string;

	@Column()
	public turn: number;

	@ManyToOne( type => GameEntity, game => game.gameStates )
	public game?: GameEntity;
}
