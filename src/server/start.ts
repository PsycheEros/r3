import './polyfills';

import cluster from 'cluster';

import { workers } from 'data/config.yaml';

const stopSignals = [ 'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM' ] as NodeJS.Signals[],
	{ NODE_ENV} = process.env,
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
	console.log( `Starting ${workers} workers...` );
	for( let i = 0; i < workers; ++i ) {
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
	require( './app' );
}
