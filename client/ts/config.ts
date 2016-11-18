( () => {
	SystemJS.config( {
		baseURL: '/',
		paths: {
			'npm:*': 'lib/*',
			'rxjs/*': 'rxjs',
		},
		bundles: {
			'npm:rxjs/bundles/Rx.min.js': [ 'rxjs/*' ]
		},
		map: {
			app: 'js',
			rxjs: 'npm:rxjs',
			'ng2-bootstrap': 'npm:ng2-bootstrap/bundles/ng2-bootstrap.umd.js',
			'reflect-metadata': 'npm:reflect-metadata/Reflect.js',
			tslib: 'npm:tslib/tslib.js',
			'@angular': 'npm:@angular',
			'angular2-auto-scroll': 'npm:angular2-auto-scroll',
			bootstrap: 'npm:bootstrap/dist/js/bootstrap.min.js',
			tether: 'npm:tether/dist/js/tether.min.js',
			jquery: 'npm:jquery/dist/jquery.min.js',
			mathjs: 'npm:mathjs/dist/math.min.js',
			moment: 'npm:moment/moment.js',
			uuid: 'npm:uuid'
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
			'rxjs/*': {
				deps: [ 'tslib' ]
			},
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
