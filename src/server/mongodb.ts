import { Observable } from 'rxjs';
import { ChangeStreamOptions, Collection, Db, MongoClient } from 'mongodb';
import { url, clientOptions, dbName, dbOptions } from 'data/mongodb.config.yaml';
import { shuttingDown } from './shut-down';

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
		const client = await MongoClient.connect( url, clientOptions );
		const db = client.db( dbName, dbOptions );
		const collections = {
			expirations: db.collection( 'expiration' ),
			games: db.collection( 'game' ),
			rooms: db.collection( 'room' ),
			roomSessions: db.collection( 'roomSession' ),
			sessions: db.collection( 'session' ),
			users: db.collection( 'user' )
		};
		shuttingDown.subscribe( async () => {
			await client.close();
		} );
		return { db, client, collections };
	} )();
	return connection;
}
