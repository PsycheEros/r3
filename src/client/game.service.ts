import { SchedulerLike, Observable, Subject } from 'rxjs';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { SessionService } from './session.service';
import { observeOn, shareReplay, scan, takeUntil } from 'rxjs/operators';
import { tapLog } from 'src/operators';

@Injectable()
export class GameService implements OnDestroy {
	constructor(
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike,
		@Inject(SessionService)
		private readonly sessionService: SessionService
	) {
		this.allGames =
		sessionService.getEvents<Game>( 'update' )
		.pipe(
			takeUntil( this.destroyed ),
			scan<Game, Game[]>( ( prev, game ) => {
				const games = [ ...prev ];
				const index = games.findIndex( g => g.gameId === game.gameId );
				if( index >= 0 ) {
					games.splice( index, 1, game );
				} else {
					games.push( game );
				}
				return games;
			}, [] as Game[] ),
			shareReplay( 1 )
		);
	}

	public ngOnDestroy() {
		this.destroyed.next( true );
		this.destroyed.complete();
	}

	public getGames() {
		const { allGames, scheduler } = this;
		return allGames.pipe( observeOn( scheduler ) );
	}

	public async newGame( roomId: string, ruleSet: RuleSet ) {
		const { sessionService } = this;
		return await sessionService.emit<Game>( 'newGame', { roomId, ruleSet } );
	}

	public async makeMove( roomId: string, position: Point ) {
		const { sessionService } = this;
		await sessionService.emit( 'makeMove', { roomId, position } );
	}

	private readonly destroyed = new Subject<true>();
	private readonly allGames: Observable<Game[]>;
}
