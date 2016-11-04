import MapRepository from './map';

export default class RoomRepository extends MapRepository<RoomRecord> {
	public constructor() {
		super( 'roomId' );
	}
}
