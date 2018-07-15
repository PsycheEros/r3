import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { GameStateEntity } from './game-state.entity';
import { RoomEntity } from './room.entity';
import { MetadataField } from './metadata.field';
import { sortBy } from 'lodash';
import { SizeField } from 'server/size.field';

@Entity( 'Game' )
export class GameEntity {
	@PrimaryGeneratedColumn( 'uuid' )
	public id: string;

	@Column( () => MetadataField )
	public meta: MetadataField;

	@Column( 'simple-array' )
	public colors: string[];

	@OneToMany( () => GameStateEntity, gameState => gameState.game, {
		cascade: true
	} )
	public gameStates: GameStateEntity[];

	@Column( () => SizeField )
	public size: SizeField;

	@Column()
	public mask: string;

	@OneToOne( () => RoomEntity, { nullable: true } )
	public room: RoomEntity;

	@Column()
	public ruleSet: RuleSet;

	static toGame( gameEntity: GameEntity ): Game {
		const gameStates = sortBy( gameEntity.gameStates, gs => gs.index );
		return {
			gameId: gameEntity.id,
			size: { ...gameEntity.size },
			colors: [ ...gameEntity.colors ],
			mask: gameEntity.mask.split( '' ).map( m => m === '1' ),
			ruleSet: gameEntity.ruleSet,
			gameStates: gameStates.map( gs => ( {
				index: gs.index,
				turn: gs.turn,
				data: gs.data.map( v => ( v === 'x' ) ? null : parseInt( v, 10 ) ),
				lastMove: ( gs.lastMove.x == null || gs.lastMove.y == null ) ? null : { ...gs.lastMove }
			} ) )
		};
	}
}
