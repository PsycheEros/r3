import cluster = require( 'cluster' );
const stopSignals = [ 'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM' ],
	{ NODE_ENV, NODE_CLUSTER_WORKERS = 4 } = process.env,
	production = NODE_ENV === 'production';

let stopping = false;

cluster.on( 'disconnect', () => {
	if( production ) {
		if( !stopping ) {
			cluster.fork();
		}
	} else {
		process.exit( 1 );
	}
} );

if( cluster.isMaster ) {
	console.log( `Starting ${NODE_CLUSTER_WORKERS} workers...` );
	for( let i = 0; i < NODE_CLUSTER_WORKERS; ++i ) {
		cluster.fork();
	}
	if( production ) {
		stopSignals.forEach( signal => {
			process.on( signal, () => {
				console.log( `Got ${signal}, stopping workers...` );
				stopping = true;
				cluster.disconnect( () => {
					console.log( 'All workers stopped, exiting.' );
					process.exit( 0 );
				} );
			} );
		} );
	}
} else {
	require( './app.js' );
}
