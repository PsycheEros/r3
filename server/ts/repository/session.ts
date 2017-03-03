import { MapRepository } from './map';

export class SessionRepository extends MapRepository<SessionRecord> {
	public constructor() {
		super( 'sessionId' );
	}
}
