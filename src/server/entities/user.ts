import { Entity, Index, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, JoinTable } from 'typeorm';
import { LoginEntity } from './login';
import { SessionEntity } from './session';

@Entity( 'User' )
export class UserEntity {
	@PrimaryGeneratedColumn( 'uuid', { name: 'UserID' } )
	public userId: string;

	@Column( { name: 'Nick' } )
	public nick: string;

	@OneToMany( type => SessionEntity, session => session.user )
	public sessions: SessionEntity[];

	@OneToOne( type => LoginEntity, login => login.user, {
		cascade: true
	} )
	@JoinColumn()
	public login: LoginEntity;
}
