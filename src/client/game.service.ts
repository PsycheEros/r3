import { SchedulerLike, Observable, Subject, BehaviorSubject } from 'rxjs';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { observeOn, shareReplay, scan, takeUntil } from 'rxjs/operators';
import { toMap } from 'src/operators';
import { SocketService } from './socket.service';

@Injectable()
export class GameService implements OnDestroy {
	constructor(
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike,
		private readonly socketService: SocketService
	) {
		socketService.getMessages<ClientGame>( 'update' )
		.pipe(
			takeUntil( this.destroyed ),
			scan<ClientGame, ClientGame[]>( ( prev, game ) => {
				const games = [ ...prev ];
				const index = games.findIndex( g => g.id === game.id );
				if( index >= 0 ) {
					games.splice( index, 1, game );
				} else {
					games.push( game );
				}
				return games;
			}, [] ),
			toMap( game => game.id )
		).subscribe( this.allGames );
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
		const { socketService } = this;
		return await socketService.send<ClientGame>( 'newGame', { roomId, ruleSet } );
	}

	public async makeMove( roomId: string, position: Point ) {
		const { socketService } = this;
		await socketService.send( 'makeMove', { roomId, position } );
	}

	private readonly destroyed = new Subject<true>();
	private readonly allGames = new BehaviorSubject( new Map<string, ClientGame>() );
}
