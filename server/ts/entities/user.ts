import { Table, Index, Column, PrimaryColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { LoginEntity } from './login';
import { SessionEntity } from './session';


@Table( 'User' )
export class UserEntity {
	@PrimaryColumn( { name: 'UserID' } )
	public userId: string;

	@Column( { name: 'Nick' } )
	public nick: string;

	@OneToMany( type => SessionEntity, session => session.user )
	public sessions = [] as SessionEntity[];

	@OneToOne( type => LoginEntity, login => login.user, {
		cascadeAll: true
	} )
	@JoinColumn()
	public login: LoginEntity;
}
