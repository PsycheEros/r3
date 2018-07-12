import { MapRepository } from 'server/repository/map';

export class RoomRepository extends MapRepository<RoomRecord> {
	public constructor() {
		super( 'roomId' );
	}
}
