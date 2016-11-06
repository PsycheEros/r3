declare interface SocketMessage<T> {
	messageId: string;
	name: string;
	data: T;
}
