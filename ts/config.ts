( () => {
	SystemJS.config( {
		paths: {
			app: 'js'
		},
		packages: {
			app: {
				main: 'default',
				defaultExtension: 'js'
			}
		},
		transpiler: false
	} );
} )();
