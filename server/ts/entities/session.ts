import { Table, Index, Column, PrimaryColumn, ManyToOne, ManyToMany } from 'typeorm';
import { UserEntity } from './user';
import { RoomEntity } from './room';

@Table( 'Session' )
export class SessionEntity {
	@PrimaryColumn()
	public sessionId: string;

	@Column()
	public userId: string;

	@ManyToOne( type => UserEntity, userEntity => userEntity.sessions )
	public user: UserEntity;

	@ManyToMany( type => RoomEntity, room => room.sessions )
	public rooms = [] as RoomEntity[];
}
