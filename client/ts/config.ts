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
			mathjs: 'lib/mathjs/dist/math.min.js',
			moment: 'lib/moment/moment.js',
			'ng2-bootstrap': 'lib/ng2-bootstrap/bundles/ng2-bootstrap.umd.js'
		},
		map: {
			'@angular': 'lib/@angular',
			'angular2-auto-scroll': 'lib/angular2-auto-scroll',
			uuid: 'lib/uuid'
		},
		packages: {
			app: {
				main: 'default',
				defaultExtension: 'js'
			},
			uuid: {
				main: 'uuid.js',
				defaultExtension: 'js',
				map: {
					'./rng': './rng-browser' 
				}
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
			},
			'angular2-auto-scroll': {
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
