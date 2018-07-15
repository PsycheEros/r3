import express from 'express';
import csp from 'express-csp';
import path from 'path';
import compression from 'compression';
import { appSettings, cspPolicy } from 'data/config.yaml';

export const app = express();
for( const [ key, value ] of Object.entries( appSettings ) ) {
	app.set( key, value );
}
app.use( compression(), express.static( path.join( __dirname, 'www' ) ) );
csp.extend( app, cspPolicy );
app.use( require( 'body-parser' ).json() );
app.get( '/health', ( req, res ) => {
	res.writeHead( 200 );
	res.end();
} );
