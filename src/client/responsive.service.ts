import { Injectable,  OnDestroy } from '@angular/core';

import { Subject, Observable, fromEvent } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { breakpoints } from 'data/responsive.yaml';

@Injectable()
export class ResponsiveService implements OnDestroy {
	private readonly width: Observable<number>;
	private readonly destroyed = new Subject<true>();

	public constructor() {
		this.width =
			fromEvent( window, 'resize', { passive: true } )
			.pipe(
				map( () => window.innerWidth ),
				shareReplay( 1 )
			);
	}

	public getBreakpoint() {
		return this.width.pipe(
			map( width => {
				for( const [ key, max ] of Object.entries( breakpoints ) ) {
					if( width < max ) return key as ResponsiveBreakpoint;
				}
			} ),
			distinctUntilChanged()
		);
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}
}
