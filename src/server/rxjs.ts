import { EventEmitter } from 'events';
import { fromEventPattern } from 'rxjs';

type EventTarget = Pick<NodeJS.EventEmitter|EventEmitter, 'addListener'|'removeListener'>;

export const fromNodeEvent = <T>( target: EventTarget, event: string ) =>
	fromEventPattern<T>(
		e => { target.addListener( event, e as any ); },
		e => { target.removeListener( event, e as any ); }
	);
