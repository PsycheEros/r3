import { Table, Index, Column, PrimaryColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user';

@Table()
export class LoginEntity {
	public constructor( data: Partial<LoginEntity> = {} ) {
		Object.assign( this, data );
	}

	@PrimaryColumn( { length: 36 } )
	@OneToOne( type => UserEntity, user => user.login )
	public userId: string;

	@Column()
	@Index( { unique: true } )
	public username: string;

	@Column()
	public passwordHash: string;

	@OneToOne( type => UserEntity, user => user.login )
	public user: UserEntity;
}
