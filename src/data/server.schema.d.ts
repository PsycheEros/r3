declare interface ServerGame {
	_id: string;
	colors: ReadonlyArray<string>;
	ruleSet: RuleSet;
	gameStates: ReadonlyArray<ServerGameState>;
}

declare interface ServerGameState {
	time: number;
	turn: number|null;
	lastMove: Point|null;
	size: Size;
	mask: ReadonlyArray<boolean>;
	data: ReadonlyArray<number>;
}

declare interface ServerRoom {
	_id: string;
	name: string;
	passwordHash: string;
	gameId: string|null;
}

declare interface ServerRoomSession {
	_id: string;
	roomId: string;
	sessionId: string;
	colors: number[];
}

declare interface ServerExpiration {
	_id: string;
	expires: number;
}

declare interface ServerSession {
	_id: string;
	nick: string;
}

declare interface ServerUser {
	_id: string;
	nick: string;
	passwordHash: string;
}