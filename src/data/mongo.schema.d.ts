import { Binary } from 'mongodb';
import { Int32 } from 'bson';

declare global {
	export interface MongoExpiration {
		_id: Binary;
		expires: Date;
	}

	export interface MongoGame {
		_id: Binary;
		colors: ReadonlyArray<string>;
		ruleSet: RuleSet;
		gameStates: ReadonlyArray<MongoGameState>;
	}

	export interface MongoGameState {
		time: Date;
		turn: Int32|null;
		lastMove: Point<Int32>|null;
		size: Size<Int32>;
		data: ReadonlyArray<boolean|Int32>;
	}

	export interface MongoRoom {
		_id: Binary;
		name: string;
		passwordHash: Binary|null;
		gameId: Binary|null;
	}

	export interface MongoRoomSession {
		roomId: Binary;
		sessionId: Binary;
		seats: ReadonlyArray<Int32>;
	}

	export interface MongoSession {
		_id: Binary;
		nick: string;
		token: Binary;
		userId: Binary|null;
	}

	export interface MongoUser {
		_id: Binary;
		nick: string;
		passwordHash: Binary|null;
		roles: ReadonlyArray<string>;
	}
}
