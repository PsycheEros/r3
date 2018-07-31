import { Binary } from 'mongodb';

declare global {
	export interface ServerExpiration {
		_id: Binary;
		expires: Date;
	}

	export interface ServerGame {
		_id: Binary;
		colors: ReadonlyArray<string>;
		ruleSet: RuleSet;
		gameStates: ReadonlyArray<ServerGameState>;
	}

	export interface ServerGameState {
		time: Date;
		turn: number|null;
		lastMove: Point|null;
		size: Size;
		data: ReadonlyArray<boolean|number>;
	}

	export interface ServerRoom {
		_id: Binary;
		name: string;
		passwordHash: Binary|null;
		gameId: Binary|null;
	}

	export interface ServerRoomSession {
		roomId: Binary;
		sessionId: Binary;
		seats: ReadonlyArray<number>;
	}

	export interface ServerSession {
		_id: Binary;
		nick: string;
		token: Binary;
		userId: Binary|null;
	}

	export interface ServerUser {
		_id: Binary;
		nick: string;
		passwordHash: Binary|null;
		roles: ReadonlyArray<string>;
	}
}
