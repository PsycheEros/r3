import { Board } from 'src/board';

export class GameState {
	public board = new Board;
	public turn = 0;

	public serialize(): SerializedGameState {
		const { board, turn } = this;
		return {
			board: board.serialize(),
			turn
		};
	}

	public deserialize( { board, turn }: SerializedGameState ) {
		this.board.deserialize( board );
		Object.assign( this, { turn } );
		return this;
	}

	public static deserialize( data: SerializedGameState ) {
		return ( new GameState ).deserialize( data );
	}

	public clone() {
		return GameState.deserialize( this.serialize() );
	}
}
