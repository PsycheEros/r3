const express = require( 'express' ),
	{ NODE_PORT = 3000, NODE_IP = 'localhost' } = process.env,
	app = express(),
	api = express.Router(); // eslint-disable-line new-cap
require( 'express-ws' )( app );

app.get( '/health', ( req, res ) => {
	res.writeHead( 200 );
	res.end();
} );

api.ws( '/echo', ( ws, res ) => {
	ws.on( 'message', msg => {
		ws.send( msg );
	} );
} );

app.use( '/api', api );

app.listen( NODE_PORT, NODE_IP, () => {
	console.log( `Application worker ${process.pid} started...` );
} );
