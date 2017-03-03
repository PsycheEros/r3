declare interface SocketMessageRequestIn<T> {
	messageId?: string;
	name: string;
	data: T;
	rsvp?: false;
}

declare interface SocketMessageRequestInRsvp<T> {
	messageId?: string;
	name: string;
	data: T;
	rsvp: true;
}

declare interface SocketMessageRequest<T> {
	messageId: string;
	name: string;
	data: T;
}

declare interface SocketMessageResponseResolved<T> {
	messageId: string;
	name: 'ack';
	data: T;
}

declare interface SocketMessageResponseRejected {
	messageId: string;
	name: 'error';
	error: string;
}

declare type SocketMessageResponse<T> = SocketMessageResponseResolved<T>|SocketMessageResponseRejected;
declare type SocketMessage<T> = SocketMessageRequest<T>|SocketMessageResponse<T>;
