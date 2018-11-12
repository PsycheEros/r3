import express from 'express';
import csp from 'express-csp';
import path from 'path';
import compression from 'compression';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { appSettings, cspPolicy } from 'data/app.config.yaml';
import { shutDown, onShutDown } from './shut-down';
import { promisify } from 'util';

export const app = express();
if( process.env.PORT ) appSettings[ 'port' ] = parseInt( process.env.PORT, 10 );
for( const [ key, value ] of Object.entries( appSettings ) ) {
	app.set( key, value );
}

app.use(
	( req, res, next ) => {
		if( /[-._\/][0-9a-f]{20,32}[-._\/]/.test( req.url ) ) {
			res.header( 'Cache-Control', 'public, only-if-cached, immutable' );
		}
		next();
	}
);

app.use(
	compression(),
	express.static( path.join( __dirname, 'www' ) )
);

csp.extend( app, cspPolicy );

app.post( '/debug/resetAll', async ( req, res, next ) => {
	try {
		const { collections } = await ( await import( './mongodb' ) ).connectMongodb();
		const { localBus } = await import( './bus' );
		await Promise.all( [
			collections.expirations.deleteMany( {} ),
			collections.sessions.deleteMany( {} ),
			collections.rooms.deleteMany( {} ),
			collections.roomSessions.deleteMany( {} ),
			collections.users.deleteMany( {} )
		] );
		localBus.next( { type: BusMessageType.UpdateRoom, data: {} } );
		localBus.next( { type: BusMessageType.UpdateSession, data: {} } );
		localBus.next( { type: BusMessageType.UpdateRoomSession, data: {} } );
		res.status( 204 );
		res.end();
	} catch( ex ) {
		next( ex );
	}
} );

app.get( '/debug/checkSchema', async ( req, res, next ) => {
	try {
		const { collections } = await ( await import( './mongodb' ) ).connectMongodb();

		res.status( 200 );
		res.contentType( 'text/plain' );

		for( const collection of Object.values( collections ) as any ) {
			const { validator } = collection.s.options;
			if( !validator ) continue;
			const docs = await collection.find( { $nor: [ validator ] } ).toArray();
			if( docs.length === 0 ) continue;
			res.write( `${collection.s.name}\n` );
			for( const doc of docs ) {
				res.write( `${JSON.stringify( doc, null, 4 )}\n\n` );
			}
		}
		res.end();
	} catch( ex ) {
		next( ex );
	}
} );

export const server = new Server( app );

server.listen( app.get( 'port' ), app.get( 'host' ), err => {
	if( err ) {
		console.error( err );
		shutDown();
		return;
	}
	const { address, port } = server.address() as AddressInfo;
	console.log( `Process ${process.pid} listening at ${address}:${port}...` );
} );

onShutDown( () =>
	promisify( server.close ).call( server )
);
