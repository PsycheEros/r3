declare interface Responder {
	resolve( data: any );
	reject( error: Error );
}
