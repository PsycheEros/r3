( () => {
	SystemJS.config( {
		paths: {
			app: 'js',
			'socket.io-client': 'lib/socket.io-client/socket.io.js'
		},
		packages: {
			app: {
				main: 'client/default',
				defaultExtension: 'js'
			}
		},
		transpiler: false
	} );
} )();
