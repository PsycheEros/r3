declare interface ClientGame {
	id: string;
	colors: ReadonlyArray<string>;
	ruleSet: RuleSet;
	gameStates: ReadonlyArray<ClientGameState>;
}

declare interface ClientSession {
	id: string;
	nick: string;
}

declare interface ClientGameState {
	time: number;
	turn: number|null;
	lastMove: Point|null;
	size: Size;
	data: ReadonlyArray<boolean|number>;
}

declare interface ClientRoom {
	id: string;
	name: string;
	hasPassword: boolean;
	gameId: string|null;
}

declare interface ClientRoomSession {
	roomId: string;
	sessionId: string;
	seats: number[];
}
