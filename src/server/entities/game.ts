import { Entity, Index, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, JoinTable } from 'typeorm';
import { GameStateEntity } from './game-state';

@Entity( 'Game' )
export class GameEntity {
	@PrimaryGeneratedColumn( 'uuid', { name: 'GameID' } )
	public gameId: string;

	@OneToMany( type => GameStateEntity, gameState => gameState.game, {
		cascade: true
	} )
	public gameStates: GameStateEntity[];
}
