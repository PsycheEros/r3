import { Table, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { GameStateEntity } from './game-state';

@Table( 'Game' )
export class GameEntity {
	@PrimaryColumn( { name: 'GameID' } )
	public gameId: string;

	@OneToMany( type => GameStateEntity, gameState => gameState.game, {
		cascadeAll: true
	} )
	public gameStates = [] as GameStateEntity[];
}
