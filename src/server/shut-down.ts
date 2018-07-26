import { ReplaySubject, of } from 'rxjs';
import { mergeMap, mapTo, take, concatMap, switchMap } from 'rxjs/operators';
import { fromNodeEvent } from './rxjs';
import cluster from 'cluster';

type ShutDownHook = () => void|PromiseLike<void>;

const shutDownFns = [] as ShutDownHook[];

const _shuttingDown = new ReplaySubject<true>( 1 );
export const shuttingDown = _shuttingDown.pipe( take( 1 ) );
export function shutDown() {
	_shuttingDown.next( true );
	_shuttingDown.complete();
}

export function onShutDown( fn: ShutDownHook ) {
	shutDownFns.push( fn );
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

_shuttingDown
.pipe(
	switchMap( () => shutDownFns ),
	concatMap( fn => Promise.resolve( fn() ) )
)
.subscribe( {
	complete: () => {
		process.exit( 0 );
	},
	error: err => {
		console.error( err );
		process.exit( 1 );
	}
} );
