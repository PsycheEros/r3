import { Entity, Index, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, JoinTable } from 'typeorm';
import { GameEntity } from './game';
import { SessionEntity } from './session';

@Entity( 'Room' )
export class RoomEntity {
	@PrimaryGeneratedColumn( 'uuid', { name: 'RoomID' } )
	public roomId: string;

	@Column( { name: 'GameID' } )
	public gameId: string;

	@Column( { name: 'Name' } )
	public name: string;

	@Column( { name: 'Password' } )
	public password: string;

	@OneToOne( type => GameEntity )
	@JoinColumn()
	public game: GameEntity;

	@ManyToMany( type => SessionEntity, session => session.rooms )
	@JoinTable()
	public sessions: SessionEntity[];
}
