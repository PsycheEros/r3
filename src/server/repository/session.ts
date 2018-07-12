import { MapRepository } from 'server/repository/map';

export class SessionRepository extends MapRepository<SessionRecord> {
	public constructor() {
		super( 'sessionId' );
	}
}
