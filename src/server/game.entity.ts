import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { GameStateEntity } from './game-state.entity';
import { RoomEntity } from './room.entity';
import { Game } from 'src/game';
import { GameState } from 'src/game-state';
import { Board } from 'src/board';
import { MetadataField } from './metadata.field';
import { sortBy } from 'lodash';
import { ruleSetMap } from 'src/rule-sets';

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

	@OneToOne( () => RoomEntity, { nullable: true } )
	public room: RoomEntity;

	@Column()
	public ruleSet: RuleSet;

	static toGame( gameEntity: GameEntity ): Game {
		const gameStates = sortBy( gameEntity.gameStates, gs => gs.index );
		const rules = ruleSetMap.get( gameEntity.ruleSet );
		const game = rules.newGame( gameEntity.id );
		game.gameStates = gameStates.map( () => Object.assign( new GameState, {
			board: new Board
		} ) );
		return game;
	}
}
