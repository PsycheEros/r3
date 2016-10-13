const express = require( 'express' ),
	{ NODE_PORT = 3000, NODE_IP = 'localhost' } = process.env,
	app = express(),
	ws = express.Router(); // eslint-disable-line new-cap
require( 'express-ws' )( app );

app.get( '/health', ( req, res ) => {
	res.writeHead( 200 );
	res.end();
} );

ws.ws( '/echo', ( ws, res ) => {
	ws.on( 'message', msg => {
		ws.send( msg );
	} );
} );

app.use( express.static( 'client' ) );

app.use( '/ws', ws );

app.listen( NODE_PORT, NODE_IP, () => {
	console.log( `Application worker ${process.pid} started...` );
} );
