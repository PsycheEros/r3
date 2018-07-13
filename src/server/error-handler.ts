process.on( 'uncaughtException', err => {
	console.error( `${(new Date).toUTCString()} uncaughtException: ${err}\n${err.stack}` );
	process.exit( 1 );
} );

process.on( 'unhandledRejection', ( err = {} ) => {
	console.error( `${(new Date).toUTCString()} unhandledRejection: ${err}\n${err.stack}` );
} );
