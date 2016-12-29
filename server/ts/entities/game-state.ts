import { Table, Index, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { GameEntity } from './game';

@Table()
export class GameStateEntity {
	public constructor( data: Partial<GameStateEntity> = {} ) {
		Object.assign( this, data );
	}

	@PrimaryColumn( { length: 36 } )
	public gameStateId: string;

	@Column( { length: 36 } )
	public gameId: string;

	@Column( { type: 'int' } )
	public turn: number;

	@ManyToOne( type => GameEntity, game => game.gameStates )
	public game?: GameEntity;
}
