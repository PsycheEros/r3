( () => {
	SystemJS.config( {
		paths: {
			app: 'js',
			'socket.io-client': 'lib/socket.io-client/socket.io.js',
			'reflect-metadata': 'lib/reflect-metadata/Reflect.js',
			'rxjs/*': 'lib/rxjs/bundles/Rx.min.js',
			bootstrap: 'lib/bootstrap/dist/js/bootstrap.min.js',
			tether: 'lib/tether/dist/js/tether.min.js',
			jquery: 'lib/jquery/dist/jquery.min.js',
			mathjs: 'lib/mathjs/dist/math.min.js'
		},
		map: {
			'@angular': 'lib/@angular',
			'@ng-bootstrap/ng-bootstrap': 'lib/@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js',
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
		meta: {
			bootstrap: {
				deps: [ 'jquery', 'tether' ]
			},
			tether: {
				exports: 'Tether'
			}
		},
		transpiler: false
	} );
} )();
