import { app } from './app';

app.get( '/health', ( req, res ) => {
	res.writeHead( 200 );
	res.end();
} );
