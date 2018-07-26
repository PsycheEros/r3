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
app.use( compression(), express.static( path.join( __dirname, 'www' ) ) );
csp.extend( app, cspPolicy );

app.post( '/debug/resetAll', async ( req, res, next ) => {
	try {
		const { collections } = await ( require( './mongodb' ).connectMongodb() );
		await Promise.all( [
			collections.expirations.deleteMany( {} ),
			collections.sessions.deleteMany( {} ),
			collections.rooms.deleteMany( {} ),
			collections.roomSessions.deleteMany( {} ),
			collections.users.deleteMany( {} )
		] );
		res.status( 204 );
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
