import { Column } from 'typeorm';

export class PointField {
	@Column( { type: 'integer' } )
	public x: number;

	@Column( { type: 'integer' } )
	public y: number;
}

export class PointFieldNull {
	@Column( { type: 'integer', nullable: true } )
	public x: number;

	@Column( { type: 'integer', nullable: true } )
	public y: number;
}
