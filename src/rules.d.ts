declare interface Rules {
	readonly name: string;
	readonly ruleSet: RuleSet;
	readonly colors: number;
	readonly boardSize: Readonly<Size>;
	isValid( game: Game, gameState: GameState, position: Point, color: number ): boolean;
	compareScores( score1: number, score2: number ): number;
	getValidMoves( game: Game, gameState: GameState, color: number ): Point[];
	isGameOver( game: Game, gameState: GameState ): boolean;
	makeMove( game: Game, gameState: GameState, position: Point ): GameState|null;
	getScore( game: Game, gameState: GameState, color: number ): number;
	newGame( gameId: string ): Game;
}
