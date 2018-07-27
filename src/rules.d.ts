declare interface Rules {
	readonly name: string;
	readonly ruleSet: RuleSet;
	readonly seats: number;
	readonly boardSize: Readonly<Size>;
	isValid( gameState: ClientGameState, position: Point, seat: number ): boolean;
	compareScores( score1: number, score2: number ): number;
	getValidMoves( gameState: ClientGameState, seat: number ): Point[];
	isGameOver( gameState: ClientGameState ): boolean;
	makeMove( gameState: ClientGameState, position: Point ): ClientGameState|null;
	getScore( gameState: ClientGameState, seat: number ): number;
	getInitialState(): ClientGameState;
}
