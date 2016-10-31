import Repository from './repository';

export default class RoomRepository extends Repository<Room> {
	public constructor() {
		super( 'roomId' );
	}
}
