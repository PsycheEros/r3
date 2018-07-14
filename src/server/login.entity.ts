import { Entity, Index, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { MetadataField } from 'server/metadata.field';

@Entity( 'Login' )
export class LoginEntity {
	@PrimaryGeneratedColumn( 'uuid' )
	public id: string;

	@Column( () => MetadataField )
	public meta: MetadataField;

	@Column()
	@Index( { unique: true } )
	public username: string;

	@Column()
	public passwordHash: string;

	@OneToOne( () => UserEntity, user => user.login )
	public user: UserEntity;

	@Column( 'uuid', { nullable: true } )
	public userId: string;
}
