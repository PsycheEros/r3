import { Express } from 'express';

export function register( app: Express ) {
	app.get( '/health', ( req, res ) => {
		res.writeHead( 200 );
		res.end();
	} );
}
