import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class MetadataField {
	@CreateDateColumn( { select: false } )
	public created: Date;

	@UpdateDateColumn( { select: false } )
	public updated: Date;
}
