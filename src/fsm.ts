import { BehaviorSubject, Observable } from 'rxjs';

export class Fsm {
	public addState( name: string ) {
		const { stateMap } = this;
		const state = new FsmState( name );
		stateMap.set( name, state );
		return state;
	}

	public setState( state: FsmState ) {
		const { stateStack, stateSubject } = this;
		stateStack[ Math.max( 0, stateStack.length - 1 ) ] = state;
		stateSubject.next( state );
	}

	public pushState( state: FsmState ) {
		const { stateStack, stateSubject } = this;
		stateStack.push( state );
		stateSubject.next( state );
	}

	public popState() {
		const { stateStack, stateSubject } = this,
			prevState = stateStack.pop(),
			nextState = stateStack[ stateStack.length ] || null;
		stateSubject.next( nextState );
	}

	public get currentState(): Observable<FsmState|null> { return this.stateSubject; }
	private stateStack = [] as FsmState[];
	private stateMap = new Map<string, FsmState>();
	private stateSubject = new BehaviorSubject<FsmState|null>( null );
}

export class FsmState {
	public constructor( public readonly name: string ) {} 
}
