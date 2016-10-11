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
		boolean: [ 'uglify', 'fix', 'load', 'livereload', 'watch' ],
		default: { uglify: true, livereload: true, watch: true }
	} );

gulp.task( 'clean:lib', () =>
	del( [ 'lib' ] )
);

gulp.task( 'clean:js', () =>
	del( [ 'js' ] )
);

gulp.task( 'clean:css', () =>
	del( [ 'css' ] )
);

gulp.task( 'clean', gulp.parallel( 'clean:css', 'clean:lib', 'clean:js' ) );

gulp.task( 'build:scss', () =>
	gulp.src( [ 'scss/**/*.scss' ] )
	.pipe( sourcemaps.init() )
	.pipe( sass( {

	} ) )
	.pipe( sourcemaps.write() )
	.pipe( gulp.dest( 'css' ) )
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
	.pipe( sourcemaps.write() )
	.pipe( gulp.dest( 'lib' ) )
);

gulp.task( 'build:lib', gulp.series( 'clean:lib', 'build:lib:base' ) );

gulp.task( 'build:ts', () => {
	const tsproj = typescript.createProject( 'tsconfig.json');
	return tsproj.src()
		.pipe( sourcemaps.init() )
		.pipe( tsproj() )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( tsproj.options.outDir ) );
} );

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
		'*.json',
		'data/**/*.json'
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
		'scss/**/*'
	], gulp.parallel( 'build:scss' ) )
);

gulp.task( 'watch:ts', () =>
	gulp.watch( [
		'tsconfig.json',
		'ts/**/*'
	], gulp.parallel( 'build:ts' ) )
);

gulp.task( 'watch', gulp.parallel( 'watch:scss', 'watch:ts' ) );

gulp.task( 'default', gulp.parallel( 'build' ) );

gulp.task( 'webserver', gulp.parallel(
	'watch',
	() =>
		gulp.src( '.' )
		.pipe( webserver( {
			livereload: options.livereload,
			directoryListing: true,
			open: options.open
		} ) )
) );
