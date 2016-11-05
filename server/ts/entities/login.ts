import { Table, Index, Column, PrimaryColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user';

@Table( 'Login' )
export class LoginEntity {
	@PrimaryColumn( { name: 'LoginID' } )
	public loginId: string;

	@Column( { name: 'UserID' } )
	@Index( { unique: true } )
	public userId: string;

	@Column( { name: 'Username' } )
	@Index( { unique: true } )
	public username: string;

	@Column( { name: 'PasswordHash' } )
	public passwordHash: string;

	@OneToOne( type => UserEntity, user => user.login )
	public user: UserEntity;
}
