const gulp = require( 'gulp' ),
	gulpIf = require( 'gulp-if' ),
	del = require( 'del' ),
	sass = require( 'gulp-sass' ),
	typescript = require( 'gulp-typescript' ),
	concat = require( 'gulp-concat' ),
	uglify = require( 'gulp-uglify' ),
	sourcemaps = require( 'gulp-sourcemaps' ),
	tslint = require( 'gulp-tslint' ),
	eslint = require( 'gulp-eslint' ),
	webserver = require( 'gulp-webserver' ),
	minimist = require( 'minimist' ),
	options = minimist( process.argv.slice( 2 ), {
		boolean: [ 'uglify', 'fix', 'open', 'livereload', 'watch' ],
		default: { uglify: true, livereload: true, watch: true }
	} );

gulp.task( 'clean:lib', () =>
	del( [ 'client/lib' ] )
);

gulp.task( 'clean:js:client', () =>
	del( [ 'client/js' ] )
);

gulp.task( 'clean:js:server', () =>
	del( [ 'server/js/shared' ] )
);

gulp.task( 'clean:js', gulp.parallel( 'clean:js:client', 'clean:js:server' ) );

gulp.task( 'clean:css', () =>
	del( [ 'client/css' ] )
);

gulp.task( 'clean', gulp.parallel( 'clean:css', 'clean:lib', 'clean:js' ) );

gulp.task( 'build:scss', () =>
	gulp.src( [ 'client/scss/**/*.scss' ] )
	.pipe( sourcemaps.init() )
	.pipe( sass( {

	} ) )
	.pipe( sourcemaps.write( './' ) )
	.pipe( gulp.dest( 'client/css' ) )
);

gulp.task( 'build:lib:base', () =>
	gulp.src( [
		'node_modules/core-js/client/shim.js',
		'node_modules/systemjs/dist/system.src.js'
	] )
	.pipe( sourcemaps.init() )
	.pipe( concat( 'lib.js' ) )
	.pipe( gulpIf( options.uglify, uglify( {
		mangle: false,
		compress: true,
		preserve: 'license'
	} ) ) )
	.pipe( sourcemaps.write( './' ) )
	.pipe( gulp.dest( 'client/lib' ) )
);

gulp.task( 'build:lib', gulp.series( 'clean:lib', 'build:lib:base' ) );

gulp.task( 'build:ts:client', () => {
	const tsproj = typescript.createProject( 'tsconfig.client.json' );
	return tsproj.src()
		.pipe( sourcemaps.init() )
		.pipe( tsproj() )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( tsproj.options.outDir ) );
} );

gulp.task( 'build:ts:server', () => {
	const tsproj = typescript.createProject( 'tsconfig.server.json' );
	return tsproj.src()
		.pipe( sourcemaps.init() )
		.pipe( tsproj() )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( tsproj.options.outDir ) );
} );

gulp.task( 'build:ts', gulp.parallel( 'build:ts:client', 'build:ts:server' ) );

gulp.task( 'build', gulp.series( 'clean', gulp.parallel( 'build:lib', 'build:scss', 'build:ts' ) ) );

gulp.task( 'lint:tslint', () =>
	gulp.src( [ 'ts/**/*.ts' ] )
	.pipe( tslint( {
		formatter: 'verbose'
	} ) )
	.pipe( tslint.report( {
		emitError: true,
		reportLimit: 0,
		summarizeFailureOutput: false
	} ) )
);

gulp.task( 'lint:eslint', () =>
	gulp.src( [
		'*.{js,json}',
		'{client,server}/**/*.json',
		'server/js/**/*.js',
		'!server/js/shared/**/*'
	], { base: '.' } )
	.pipe( eslint( {
		fix: options.fix
	} ) )
	.pipe( eslint.format() )
	.pipe( gulpIf( file => file.eslint && file.eslint.fixed, gulp.dest( '.' ) ) )
	.pipe( eslint.failAfterError() )
);

gulp.task( 'lint', gulp.parallel( 'lint:tslint', 'lint:eslint' ) );

gulp.task( 'watch:scss', () =>
	gulp.watch( [
		'client/scss/**/*'
	], gulp.parallel( 'build:scss' ) )
);

gulp.task( 'watch:ts:client', () =>
	gulp.watch( [
		'tsconfig.client/json',
		'ts/{client,shared}/**/*',
		'shared/ts/**/*'
	], gulp.parallel( 'build:ts:client' ) )
);

gulp.task( 'watch:ts:server', () =>
	gulp.watch( [
		'tsconfig.server.json',
		'ts/{server,shared}/**/*'
	], gulp.parallel( 'build:ts:server' ) )
);

gulp.task( 'watch:ts', gulp.parallel( 'watch:ts:client', 'watch:ts:server' ) );

gulp.task( 'watch:client', gulp.parallel( 'watch:ts:client', 'watch:scss' ) );

gulp.task( 'watch:server', gulp.parallel( 'watch:ts:server' ) );

gulp.task( 'watch', gulp.parallel( 'watch:client', 'watch:server' ) );

gulp.task( 'default', gulp.parallel( 'build' ) );

gulp.task( 'webserver:webserver', () =>
	gulp.src( 'client' )
	.pipe( webserver( {
		livereload: options.livereload,
		directoryListing: {
			path: 'client',
			enable: true
		},
		open: options.open
	} ) )
);

gulp.task( 'webserver', gulp.parallel( 'watch:client', 'webserver:webserver' ) );
