import { MapRepository } from 'server/repository/map';

export class UserRepository extends MapRepository<UserRecord> {
	public constructor() {
		super( 'userId' );
	}
}
