import Game from '../game';
import { Component } from '@angular/core';
import { SessionService } from '../services/index';

@Component( {
	selector: 'r3',
	templateUrl: 'templates/r3.html'
} )
export class R3Component {
	public constructor( private sessionService: SessionService ) {}

	protected ngOnInit() {
		const { sessionService } = this;
		for( let gameId of [ 0, 1 ] ) {
			sessionService.getGame( gameId ).subscribe( game => {
				this.games[ gameId ] = game;
			} );
		}
	}

	public games = [ new Game( 0 ), new Game( 1 ) ] as Game[];
}
