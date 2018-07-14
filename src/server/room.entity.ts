import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, JoinTable, CreateDateColumn } from 'typeorm';
import { GameEntity } from './game.entity';
import { MetadataField } from 'server/metadata.field';

@Entity( 'Room' )
export class RoomEntity {
	@PrimaryGeneratedColumn( 'uuid' )
	public id: string;

	@Column( () => MetadataField )
	public meta: MetadataField;

	@Column()
	public name: string;

	@Column( { nullable: true } )
	public expires: Date;

	@Column()
	public password: string;

	@Column( 'uuid', { nullable: true} )
	public gameId: string;

	@OneToOne( () => GameEntity, { nullable: true } )
	@JoinColumn()
	public game: GameEntity;

	public static toRoom( roomEntity: RoomEntity ) {
		return { roomId: roomEntity.id, gameId: roomEntity.gameId, name: roomEntity.name, hasPassword: !!roomEntity.password };
	}
}
