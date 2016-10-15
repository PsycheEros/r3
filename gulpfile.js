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
	nodemon = require( 'nodemon' ),
	browserSync = require( 'browser-sync' ).create(),
	minimist = require( 'minimist' ),
	options = minimist( process.argv.slice( 2 ), {
		boolean: [ 'uglify', 'fix', 'watch' ],
		default: { uglify: true, watch: true }
	} );

gulp.task( 'browsersync:reload', done => {
	browserSync.reload();
	done();
} );

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
		style: 'compact'
	} ) )
	.pipe( sourcemaps.write( './' ) )
	.pipe( gulp.dest( 'client/css' ) )
);

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

gulp.task( 'build', gulp.series( 'clean', gulp.parallel( 'build:scss', 'build:ts' ) ) );

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
	], gulp.series( 'build:scss', 'browsersync:reload' ) )
);

gulp.task( 'watch:ts:client', () =>
	gulp.watch( [
		'tsconfig.client/json',
		'ts/{client,shared}/**/*',
		'shared/ts/**/*'
	], gulp.parallel( 'build:ts:client', 'browsersync:reload' ) )
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

gulp.task( 'server:server', () => {
	nodemon( {
		script: './server/js/app',
		watch: [ 'server/**/*' ],
		ext: 'js'
	} );

	browserSync.init( {
		ghostMode: false,
		proxy: {
			target: 'http://localhost:3000',
			ws: true
		},
		port: 8000
	} );

	gulp.watch( [ 'client/**/*.html' ] ).on( 'change', browserSync.reload );
} );

gulp.task( 'server', gulp.parallel( 'watch', 'server:server' ) );
