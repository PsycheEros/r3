declare module Express {
	export interface WebSocket {
		send( message: string|Buffer ): void;
		on( event: string, handler: Function ): void;
	}
	export interface Request {}
	export interface NextFunction {}
	export interface Application {
		ws( route: string, handler: ( ws: WebSocket, req: Request, next: NextFunction ) => void );
	}
}
