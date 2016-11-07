import { Table, Index, Column, PrimaryColumn, ManyToOne, ManyToMany } from 'typeorm';
import { UserEntity } from './user';
import { RoomEntity } from './room';

@Table()
export class SessionEntity {
	@PrimaryColumn( { length: '36' } )
	public sessionId: string;

	@Column( { length: '36', nullable: true } )
	public userId: string|undefined;

	@ManyToOne( type => UserEntity, userEntity => userEntity.sessions )
	public user?: UserEntity;

	@ManyToMany( type => RoomEntity, room => room.sessions )
	public rooms?: RoomEntity[];
}
