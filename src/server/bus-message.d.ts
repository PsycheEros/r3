declare const enum BusMessageType {
	UpdateSession = 'updateSession',
	UpdateRoomSession = 'updateRoomSession',
	UpdateRoom = 'updateRoom'
}

declare interface BusMessage {
	type: BusMessageType;
	data: object;
}
