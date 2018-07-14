import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { LoginEntity } from './login.entity';
import { SessionEntity } from './session.entity';
import { MetadataField } from 'server/metadata.field';

@Entity( 'User' )
export class UserEntity {
	@PrimaryGeneratedColumn( 'uuid' )
	public id: string;

	@Column( () => MetadataField )
	public meta: MetadataField;

	@Column( { unique: true } )
	public nick: string;

	@OneToMany( () => SessionEntity, session => session.user )
	public sessions: SessionEntity[];

	@OneToOne( () => LoginEntity, login => login.user, {
		cascade: true
	} )
	@JoinColumn()
	public login: LoginEntity;
}
