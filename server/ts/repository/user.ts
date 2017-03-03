import { MapRepository } from './map';

export class UserRepository extends MapRepository<UserRecord> {
	public constructor() {
		super( 'userId' );
	}
}
