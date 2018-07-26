import './error-handler';
import './polyfills';

import { takeUntil } from 'rxjs/operators';
import { fromNodeEvent } from './rxjs';
import { onShutDown, shuttingDown } from './shut-down';

import cluster from 'cluster';

import { workers } from 'data/cluster.config.yaml';
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

	onShutDown( async () => {
		await promisify( cluster.disconnect )();
		console.log( `All workers stopped, exiting...` );
	} );
} else {
	import( /* webpackChunkName: "main~server" */ './main' );
}
