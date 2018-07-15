declare interface Game {
	readonly gameId: string;
	readonly colors: ReadonlyArray<string>;
	readonly mask: ReadonlyArray<boolean>;
	readonly size: Readonly<Size>;
	readonly gameStates: ReadonlyArray<GameState>;
	readonly ruleSet: RuleSet;
}
