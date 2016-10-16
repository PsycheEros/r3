import Board from './board';

declare global {
	export interface GameState {
		board: Board;
		turn: number;
		isGameOver: boolean;
	}
}
