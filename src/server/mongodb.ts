import { Collection, Db, MongoClient } from 'mongodb';
import { url, clientOptions, dbOptions } from 'data/mongodb.config.yaml';
import { onShutDown } from './shut-down';

let connection: Promise<{
	collections: {
		expirations: Collection<ServerExpiration>;
		games: Collection<ServerGame>;
		rooms: Collection<ServerRoom>;
		roomSessions: Collection<ServerRoomSession>;
		sessions: Collection<ServerSession>;
		users: Collection<ServerUser>;
	},
	client: MongoClient,
	db: Db
}>;
export function connectMongodb() {
	if( !connection ) connection = ( async () => {
		const client = await MongoClient.connect( process.env.MONGODB_URI || url, clientOptions );
		const db = client.db( undefined, dbOptions );
		const collections = {
			expirations: db.collection( 'expiration' ),
			games: db.collection( 'game' ),
			rooms: db.collection( 'room' ),
			roomSessions: db.collection( 'roomSession' ),
			sessions: db.collection( 'session' ),
			users: db.collection( 'user' )
		};
		onShutDown( () => client.close() );
		return { db, client, collections };
	} )();
	return connection;
}
