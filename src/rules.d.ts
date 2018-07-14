import { Board } from './board';
import { Game } from './game';
import { Square } from './square';

declare global {
	export interface Rules {
		readonly name: string;
		readonly ruleSet: RuleSet;
		readonly colors: number;
		readonly boardSize: Readonly<Point>;
		isValid( board: Board, position: Point, color: number ): boolean;
		compare( score1: number, score2: number ): number;
		getValidMoves( board: Board, color: number ): Square[];
		isGameOver( board: Board ): boolean;
		makeMove( game: Game, position: Point ): boolean;
		getScore( board: Board, color: number ): number;
		newGame( gameId: string ): Game;
	}
}
