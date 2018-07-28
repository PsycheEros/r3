import { Collection, Db, MongoClient } from 'mongodb';
import { url, clientOptions, dbOptions } from 'data/mongodb.config.yaml';
import { onShutDown } from './shut-down';
import schema from 'data/server.schema.yaml';

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

		const validationAction = 'warn';
		const collections = {
			expirations: await db.createCollection<ServerExpiration>( 'expiration',
				{ validator: schema.expiration, validationAction }
			),
			games: await db.createCollection<ServerGame>( 'game',
				{ validator: schema.game, validationAction }
			),
			rooms: await db.createCollection<ServerRoom>( 'room',
				{ validator: schema.room, validationAction }
			),
			roomSessions: await db.createCollection<ServerRoomSession>( 'roomSession',
				{ validator: schema.roomSession, validationAction }
			),
			sessions: await db.createCollection<ServerSession>( 'session',
				{ validator: schema.session, validationAction }
			),
			users: await db.createCollection<ServerUser>( 'user',
				{ validator: schema.user, validationAction }
			)
		};
		onShutDown( () => client.close() );
		return { db, client, collections };
	} )();
	return connection;
}
