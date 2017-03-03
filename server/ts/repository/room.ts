import { MapRepository } from './map';

export class RoomRepository extends MapRepository<RoomRecord> {
	public constructor() {
		super( 'roomId' );
	}
}
