( () => {
	SystemJS.config( {
		paths: {
			app: 'js',
			'socket.io-client': 'lib/socket.io-client/socket.io.js',
			'reflect-metadata': 'lib/reflect-metadata/Reflect.js'
		},
		map: {
			'@angular': 'lib/@angular',
			rxjs: 'lib/rxjs'
		},
		packages: {
			app: {
				main: 'client/default',
				defaultExtension: 'js'
			},
			rxjs: {
				main: 'Rx.js',
				defaultExtension: 'js'
			},
			'@angular/common': {
				main: `bundles/common.umd.js`,
				defaultExtension: 'js'
			},
			'@angular/compiler': {
				main: `bundles/compiler.umd.js`,
				defaultExtension: 'js'
			},
			'@angular/core': {
				main: `bundles/core.umd.js`,
				defaultExtension: 'js'
			},
			'@angular/forms': {
				main: `bundles/forms.umd.js`,
				defaultExtension: 'js'
			},
			'@angular/http': {
				main: `bundles/http.umd.js`,
				defaultExtension: 'js'
			},
			'@angular/platform-browser': {
				main: `bundles/platform-browser.umd.js`,
				defaultExtension: 'js'
			},
			'@angular/platform-browser-dynamic': {
				main: `bundles/platform-browser-dynamic.umd.js`,
				defaultExtension: 'js'
			},
			'@angular/router': {
				main: `bundles/router.umd.js`,
				defaultExtension: 'js'
			},
			'@angular/upgrade': {
				main: `bundles/upgrade.umd.js`,
				defaultExtension: 'js'
			}
		},
		transpiler: false
	} );
} )();
