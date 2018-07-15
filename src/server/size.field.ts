import { Column } from 'typeorm';

export class SizeField {
	@Column( { type: 'integer' } )
	public width: number;

	@Column( { type: 'integer' } )
	public height: number;
}

export class SizeFieldNull {
	@Column( { type: 'integer', nullable: true } )
	public width: number;

	@Column( { type: 'integer', nullable: true } )
	public height: number;
}
