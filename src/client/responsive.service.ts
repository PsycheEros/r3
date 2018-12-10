import { Injectable,  OnDestroy, Inject } from '@angular/core';

import { Subject, Observable, fromEvent, SchedulerLike } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, takeUntil, observeOn } from 'rxjs/operators';
import { breakpoints } from 'data/responsive.yaml';
import { ZoneScheduler } from 'ngx-zone-scheduler/dist';

@Injectable()
export class ResponsiveService implements OnDestroy {
	private readonly width: Observable<number>;
	private readonly destroyed = new Subject<true>();

	public constructor(
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike
	) {
		this.width =
			fromEvent( window, 'resize', { passive: true } )
			.pipe(
				takeUntil( this.destroyed ),
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
			},
			distinctUntilChanged(),
			observeOn( this.scheduler )
		);
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}
}
