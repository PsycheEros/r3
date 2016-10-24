const gulp = require( 'gulp' ),
	gulpIf = require( 'gulp-if' ),
	del = require( 'del' ),
	sass = require( 'gulp-sass' ),
	typescript = require( 'gulp-typescript' ),
	babel = require( 'gulp-babel' ),
	sourcemaps = require( 'gulp-sourcemaps' ),
	tslint = require( 'gulp-tslint' ),
	eslint = require( 'gulp-eslint' ),
	nodemon = require( 'nodemon' ),
	browserSync = require( 'browser-sync' ).create(),
	minimist = require( 'minimist' ),
	options = minimist( process.argv.slice( 2 ), {
		boolean: [ 'uglify', 'fix' ],
		default: { uglify: true }
	} );

gulp.task( 'browsersync:reload', done => {
	browserSync.reload();
	done();
} );

gulp.task( 'clean:js:client', () =>
	del( [ 'client/js' ] )
);

gulp.task( 'clean:js:server', () =>
	del( [ 'server/js' ] )
);

gulp.task( 'clean:js', gulp.parallel( 'clean:js:client', 'clean:js:server' ) );

gulp.task( 'clean:css', () =>
	del( [ 'client/css' ] )
);

gulp.task( 'clean', gulp.parallel( 'clean:css', 'clean:js' ) );

gulp.task( 'build:scss', () =>
	gulp.src( [ 'client/scss/**/*.scss' ] )
	.pipe( sourcemaps.init() )
	.pipe( sass( {
		includePaths: [ 'node_modules/bootstrap/scss' ],
		style: 'compact'
	} ) )
	.pipe( sourcemaps.write( './' ) )
	.pipe( gulp.dest( 'client/css' ) )
);

gulp.task( 'build:ts:client', () => {
	const tsproj = typescript.createProject( 'client/tsconfig.json' );
	return gulp.src( [
		'ts/**/*.ts',
		'client/ts/**/*.ts'
	] )
	.pipe( sourcemaps.init() )
	.pipe( tsproj() )
	.pipe( babel( { presets: [ 'es2015' ] } ) )
	.pipe( sourcemaps.write( './' ) )
	.pipe( gulp.dest( 'client/js' ) );
} );

gulp.task( 'build:ts:server', () => {
	const tsproj = typescript.createProject( 'server/tsconfig.json' );
	return gulp.src( [
		'ts/**/*.ts',
		'server/ts/**/*.ts'
	] )
	.pipe( sourcemaps.init() )
	.pipe( tsproj() )
	.pipe( sourcemaps.write( './' ) )
	.pipe( gulp.dest( 'server/js' ) );
} );

gulp.task( 'build:ts', gulp.parallel( 'build:ts:client', 'build:ts:server' ) );

gulp.task( 'build', gulp.series( 'clean', gulp.parallel( 'build:scss', 'build:ts' ) ) );

gulp.task( 'lint:tslint', () =>
	gulp.src( [
		'ts/**/*.ts',
		'{client,server}/ts/**/*.ts'
	] )
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
		'{client,server}/**/*.json'
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
		'tsconfig.client.json',
		'ts/**/*',
		'client/ts/**/*'
	], gulp.series( 'build:ts:client', 'browsersync:reload' ) )
);

gulp.task( 'watch:ts:server', () =>
	gulp.watch( [
		'tsconfig.server.json',
		'ts/**/*',
		'server/ts/**/*'
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
		nodeArgs: [ '--debug' ],
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
