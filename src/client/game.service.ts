import { SchedulerLike, BehaviorSubject } from 'rxjs';
import { ZoneScheduler } from 'ngx-zone-scheduler';
import { Inject, Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { Game } from 'src/game';
import { observeOn } from 'rxjs/operators';

@Injectable()
export class GameService {
	constructor(
		@Inject(ZoneScheduler)
		private readonly scheduler: SchedulerLike,
		@Inject(SessionService)
		private readonly sessionService: SessionService
	) {
		sessionService.getEvents<SerializedGame>( 'update' )
		.subscribe( gameSerialized => {
			const allGames = this.allGames.getValue(),
				game = Game.deserialize( gameSerialized ),
				index = allGames.findIndex( g => g.gameId === game.gameId );
			if( index >= 0 ) {
				allGames.splice( index, 1, game );
			} else {
				allGames.push( game );
			}
			this.allGames.next( allGames );
		} );
	}

	public getGames() {
		const { allGames, scheduler } = this;
		return allGames.pipe( observeOn( scheduler ) );
	}

	public async newGame( roomId: string, ruleSet: RuleSet ) {
		const { sessionService } = this;
		return await sessionService.emit<SerializedGame>( 'newGame', { roomId, ruleSet } );
	}

	public async makeMove( roomId: string, position: Point ) {
		const { sessionService } = this;
		await sessionService.emit( 'makeMove', { roomId, position } );
	}

	private readonly allGames = new BehaviorSubject<Game[]>( [] );
}
