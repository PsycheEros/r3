import { Component, NgZone, ViewChild } from '@angular/core';
import { GameService } from 'client/game.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ruleSets } from 'src/rule-sets';

@Component( {
	selector: 'modal-new-game',
	templateUrl: 'new-game.component.html',
	styleUrls: [ './new-game.component.scss' ]
} )
export class ModalNewGameComponent {
	constructor(
		private readonly gameService: GameService,
		private readonly zone: NgZone
	) {}

	@ViewChild( 'newGameModal' )
	protected newGameModal: ModalDirective;

	public show( room: Room ) {
		const { newGameModal, zone } = this;
		zone.run( () => {
			this.roomId = room.roomId;
			newGameModal.show();
		} );
	}

	public hide() {
		const { newGameModal, zone } = this;
		zone.run( () => {
			this.roomId = null;
			newGameModal.hide();
		} );
	}

	public roomId: string|null;
	public ruleSet: RuleSet;
	public readonly ruleSets = ruleSets;

	public async newGame() {
		const { gameService, roomId, ruleSet } = this;
		this.hide();
		await gameService.newGame( roomId, ruleSet );
	}
}
