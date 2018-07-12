import { Entity, Index, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, JoinTable } from 'typeorm';
import { GameEntity } from './game';

@Entity( 'GameState' )
export class GameStateEntity {
	@PrimaryGeneratedColumn( 'uuid', { name: 'GameStateID' } )
	public gameStateId: string;

	@Column( { name: 'GameID' } )
	public gameId: string;

	@Column( { name: 'Turn' } )
	public turn: number;

	@ManyToOne( type => GameEntity, game => game.gameStates )
	public game: GameEntity;
}
