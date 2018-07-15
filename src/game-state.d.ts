declare interface GameState {
	readonly index: number;
	readonly data: ReadonlyArray<number|null>;
	readonly turn: number|null;
	readonly lastMove: Readonly<Point>|null;
}
