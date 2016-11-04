import MapRepository from './map';

export default class SessionRepository extends MapRepository<SessionRecord> {
	public constructor() {
		super( 'sessionId' );
	}
}
