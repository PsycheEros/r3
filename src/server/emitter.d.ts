type Emitter = Pick<SocketIO.Socket, 'emit'|'send'>|Pick<SocketIO.Namespace, 'emit'|'send'>;
