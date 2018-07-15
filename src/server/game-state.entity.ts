import { Entity, Column, PrimaryColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { GameEntity } from './game.entity';
import { PointFieldNull } from './point.field';
import { MetadataField } from './metadata.field';

@Entity( 'GameState' )
export class GameStateEntity {
	@PrimaryColumn( 'uuid' )
	public gameId: string;

	@PrimaryColumn( { type: 'integer' } )
	public index: number;

	@Column( () => MetadataField )
	public meta: MetadataField;

	@ManyToOne( () => GameEntity, game => game.gameStates )
	public game: GameEntity;

	@Column( { type: 'integer', nullable: true } )
	public turn: number|null;

	@Column( () => PointFieldNull )
	public lastMove: PointFieldNull;

	@Column( { type: 'simple-array' } )
	public data: string[];
}
