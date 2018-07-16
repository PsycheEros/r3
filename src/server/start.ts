import './error-handler';
import './polyfills';

import { Subject, of } from 'rxjs';
import { takeUntil, mapTo, mergeMap } from 'rxjs/operators';
import { fromNodeEvent } from './rxjs';

import cluster from 'cluster';

import { workers } from 'data/config.yaml';

if( cluster.isMaster ) {
	const stopping = new Subject<number>();

	fromNodeEvent( cluster, 'disconnect' )
	.pipe( takeUntil( stopping ) )
	.subscribe( () => {
		cluster.fork();
	} );

	console.log( `Starting ${workers} workers...` );
	for( let i = 0; i < workers; ++i ) {
		cluster.fork();
	}
	of( 'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM' )
	.pipe(
		mergeMap<NodeJS.Signals, NodeJS.Signals>( sig =>
			fromNodeEvent( process, sig )
			.pipe( mapTo( sig ) )
		),
		takeUntil( stopping )
	)
	.subscribe( signal => {
		console.log( `Got ${signal}, stopping workers...` );
		stopping.next( 0 );
		stopping.complete();
	} );

	stopping
	.subscribe( code => {
		cluster.disconnect( () => {
			console.log( `All workers stopped, exiting with code ${code}.` );
			process.exit( code );
		} );
	} );
} else {
	import( /* webpackChunkName: "main~server" */ './main' );
}
