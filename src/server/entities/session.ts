import { Entity, Index, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, JoinTable } from 'typeorm';
import { UserEntity } from './user';
import { RoomEntity } from './room';

@Entity( 'Session' )
export class SessionEntity {
	@PrimaryGeneratedColumn( 'uuid', { name: 'SessionID' } )
	public sessionId: string;

	@Column( { name: 'UserID', nullable: true } )
	public userId: string;

	@Column( { name: 'Nick' } )
	public nick: string;

	@ManyToOne( type => UserEntity, userEntity => userEntity.sessions )
	public user: UserEntity;

	@ManyToMany( type => RoomEntity, room => room.sessions )
	public rooms: RoomEntity[];
}
