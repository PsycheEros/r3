import { Table, Index, Column, PrimaryColumn, OneToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { GameEntity } from './game';
import { SessionEntity } from './session';

@Table( 'Room' )
export class RoomEntity {
	@PrimaryColumn( { name: 'RoomID' } )
	public roomId: string;

	@Column( { name: 'GameID' } )
	public gameId: string;

	@Column( { name: 'Name' } )
	public name: string;

	@Column( { name: 'Password' } )
	public password = '';

	@OneToOne( type => GameEntity )
	@JoinColumn()
	public game: GameEntity;

	@ManyToMany( type => SessionEntity, session => session.rooms )
	@JoinTable()
	public sessions = [] as SessionEntity[];
}
