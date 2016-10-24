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
		sessionService.getGame().subscribe( game => {
			console.log( game );
		} );
	}

	public games = [ new Game, new Game, new Game ] as Game[];
}
