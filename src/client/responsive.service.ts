import { Injectable,  OnDestroy } from '@angular/core';

import Breakpoints from 'breakpoints-js';
import { ReplaySubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class ResponsiveService implements OnDestroy {
	public constructor() {
		Breakpoints.on( 'change', this.onChange );
		this.updateBreakpoint();
	}

	private breakpointSubject = new ReplaySubject<ResponsiveBreakpoint>( 1 );

	private readonly onChange = () => { this.updateBreakpoint(); }

	private updateBreakpoint() {
		this.breakpointSubject.next( Breakpoints.current().name );
	}

	public getBreakpoint() {
		return this.breakpointSubject.pipe(
			distinctUntilChanged()
		);
	}

	public ngOnDestroy() {
		Breakpoints.off( 'change', this.onChange );
		this.breakpointSubject.complete();
	}
}
