import { Table, Index, Column, PrimaryColumn, OneToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { GameEntity } from './game';
import { SessionEntity } from './session';

@Table( 'Room' )
export class RoomEntity {
	@PrimaryColumn()
	public roomId: string;

	@Column()
	public gameId: string;

	@Column()
	public name: string;

	@Column()
	public password = '';

	@OneToOne( type => GameEntity )
	@JoinColumn()
	public game: GameEntity;

	@ManyToMany( type => SessionEntity, session => session.rooms )
	@JoinTable()
	public sessions?: SessionEntity[];
}
