import { Table, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { GameStateEntity } from './game-state';

@Table()
export class GameEntity {
	public constructor( data: Partial<GameEntity> = {} ) {
		Object.assign( this, data );
	}

	@PrimaryColumn( { length: '36' } )
	public gameId: string;

	@OneToMany( type => GameStateEntity, gameState => gameState.game, {
		cascadeAll: true
	} )
	public gameStates = [] as GameStateEntity[];
}
