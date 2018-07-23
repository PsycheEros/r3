import { Observable, Subject, of } from 'rxjs';
import { delay, mergeMap, mapTo, take } from 'rxjs/operators';
import { fromNodeEvent } from './rxjs';
import cluster from 'cluster';

const _shuttingDown = new Subject<true>();
export const shuttingDown = _shuttingDown as Observable<true>;
export function shutDown() {
	_shuttingDown.next( true );
	_shuttingDown.complete();
}

of( 'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM' )
.pipe(
	mergeMap<NodeJS.Signals, NodeJS.Signals>( sig =>
		fromNodeEvent( process, sig )
		.pipe( mapTo( sig ) )
	)
)
.subscribe( shutDown );

if( cluster.isWorker ) {
	fromNodeEvent( cluster, 'disconnect' )
	.pipe( take( 1 ) )
	.subscribe( shutDown );
}

shuttingDown
.pipe( delay( 5000 ) )
.subscribe( () => {
	process.exit( 0 );
} );
