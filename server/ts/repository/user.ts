import MapRepository from './map';

export default class UserRepository extends MapRepository<UserRecord> {
	public constructor() {
		super( 'userId' );
	}
}
