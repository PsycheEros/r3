declare interface Rules {
	readonly name: string;
	readonly ruleSet: RuleSet;
	readonly colors: number;
	readonly boardSize: Readonly<Size>;
	isValid( gameState: ClientGameState, position: Point, color: number ): boolean;
	compareScores( score1: number, score2: number ): number;
	getValidMoves( gameState: ClientGameState, color: number ): Point[];
	isGameOver( gameState: ClientGameState ): boolean;
	makeMove( gameState: ClientGameState, position: Point ): ClientGameState|null;
	getScore( gameState: ClientGameState, color: number ): number;
	getInitialState(): ClientGameState;
}
