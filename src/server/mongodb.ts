import { Collection, Db, MongoClient } from 'mongodb';
import { url, clientOptions, dbOptions } from 'data/mongodb.config.yaml';
import { onShutDown } from './shut-down';
import jsonSchema from 'data/server.schema.yaml';

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
			expirations: await db.createCollection<ServerExpiration>( 'expiration',
				{ validator: { $jsonSchema: jsonSchema.expiration } }
			),
			games: await db.createCollection<ServerGame>( 'game',
				{ validator: { $jsonSchema: jsonSchema.game } }
			),
			rooms: await db.createCollection<ServerRoom>( 'room',
				{ validator: { $jsonSchema: jsonSchema.room } }
			),
			roomSessions: await db.createCollection<ServerRoomSession>( 'roomSession',
				{ validator: { $jsonSchema: jsonSchema.roomSession } }
			),
			sessions: await db.createCollection<ServerSession>( 'session',
				{ validator: { $jsonSchema: jsonSchema.session } }
			),
			users: await db.createCollection<ServerUser>( 'user',
				{ validator: { $jsonSchema: jsonSchema.user } }
			)
		};
		onShutDown( () => client.close() );
		return { db, client, collections };
	} )();
	return connection;
}
