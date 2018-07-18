import './error-handler';
import './polyfills';

import { takeUntil, concatMap } from 'rxjs/operators';
import { fromNodeEvent } from './rxjs';
import { shuttingDown } from './shut-down';

import cluster from 'cluster';

import { workers } from 'data/config.yaml';
import { promisify } from 'util';

if( cluster.isMaster ) {
	fromNodeEvent( cluster, 'disconnect' )
	.pipe( takeUntil( shuttingDown ) )
	.subscribe( () => {
		cluster.fork();
	} );

	console.log( `Starting ${workers} workers...` );
	for( let i = 0; i < workers; ++i ) {
		cluster.fork();
	}

	shuttingDown
	.pipe( concatMap( () => promisify( cluster.disconnect )() ) )
	.subscribe( code => {
		console.log( `All workers stopped, exiting...` );
		process.exit( 0 );
	} );
} else {
	import( /* webpackChunkName: "main~server" */ './main' );
}
