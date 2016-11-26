import { Table, Index, Column, PrimaryColumn, OneToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { GameEntity } from './game';
import { SessionEntity } from './session';

@Table()
export class RoomEntity {
	public constructor( data: Partial<RoomEntity> = {} ) {
		Object.assign( this, data );
	}

	@PrimaryColumn( { length: '36' } )
	public roomId: string;

	@Column( { length: '36' } )
	public gameId: string;

	@Column()
	public name: string;

	@Column()
	public password = '';

	@OneToOne( type => GameEntity )
	@JoinColumn()
	public game?: GameEntity;

	@ManyToMany( type => SessionEntity )
	@JoinTable()
	public sessions = [] as SessionEntity[];
}
