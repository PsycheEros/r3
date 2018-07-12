import { Entity, Index, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, JoinColumn, JoinTable } from 'typeorm';
import { UserEntity } from './user';

@Entity( 'Login' )
export class LoginEntity {
	@PrimaryGeneratedColumn( 'uuid', { name: 'LoginID' } )
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
