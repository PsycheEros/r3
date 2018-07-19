import express from 'express';
import csp from 'express-csp';
import path from 'path';
import compression from 'compression';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { appSettings, cspPolicy } from 'data/config.yaml';
import { shutDown, shuttingDown } from './shut-down';

export const app = express();
for( const [ key, value ] of Object.entries( appSettings ) ) {
	app.set( key, value );
}
app.use( compression(), express.static( path.join( __dirname, 'www' ) ) );
csp.extend( app, cspPolicy );
app.use( require( 'body-parser' ).json() );

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

shuttingDown.subscribe( () => {
	server.close( () => {} );
} );

require( './health.endpoint' ).register( app );
