declare interface SerializedGameState {
	readonly board: ReadonlyArray<number>;
	readonly turn: number;
	readonly lastMove: Readonly<Point>|null;
}

declare interface SerializedGame {
	readonly gameId: string;
	readonly ruleSet: RuleSet;
	readonly colors: ReadonlyArray<string>;
	readonly gameStates: ReadonlyArray<SerializedGameState>;
	readonly size: Readonly<Size>;
}
