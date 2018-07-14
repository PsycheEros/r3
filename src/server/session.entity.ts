import { Entity, Column, PrimaryColumn, ManyToMany, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { MetadataField } from 'server/metadata.field';

@Entity( 'Session' )
export class SessionEntity {
	@PrimaryColumn( 'uuid' )
	public id: string;

	@Column( () => MetadataField )
	public meta: MetadataField;

	@Column()
	public nick: string;

	@ManyToOne( () => UserEntity, userEntity => userEntity.sessions )
	public user: UserEntity;

	@Column( 'uuid', { nullable: true } )
	public userId: string;
}
