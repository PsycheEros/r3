import { fromEventPattern } from 'rxjs';

type EventTarget = NodeJS.EventEmitter;

export const fromNodeEvent = <T>( target: EventTarget, event: string ) =>
	fromEventPattern<T>(
		e => { target.addListener( event, e as any ); },
		e => { target.removeListener( event, e as any ); }
	);