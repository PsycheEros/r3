import gulp from 'gulp';
import del from 'del';
import log from 'gulplog';
import nodemon from 'nodemon';
import webpack from 'webpack';
import ghPages from 'gulp-gh-pages';

const browserSync = require( 'browser-sync' ).create();

gulp.task( 'browsersync:reload', done => {
	browserSync.reload();
	done();
} );

gulp.task( 'clean', () => del( [ 'dist' ] ) );

gulp.task( 'build:client', async () => {
	const compiler = webpack( require( './webpack.config.js' ).clientConfig );
	const stats = await new Promise( ( resolve, reject ) => {
		compiler.run( ( err, stats ) => {
			if( err ) reject( new Error( err ) );
			else resolve( stats );
		} );
	} );
	log.info( stats.toString() );
} );

gulp.task( 'build:server', async () => {
	const compiler = webpack( require( './webpack.config.js' ).serverConfig );
	const stats = await new Promise( ( resolve, reject ) => {
		compiler.run( ( err, stats ) => {
			if( err ) reject( new Error( err ) );
			else resolve( stats );
		} );
	} );
	log.info( stats.toString() );
} );

gulp.task( 'build', gulp.parallel( 'build:client', 'build:server' ) );

gulp.task( 'watch:client', () => new Promise( resolve => {
	const compiler = webpack( require( './webpack.config.js' ).clientConfig );
	compiler.watch( {}, ( err, stats ) => {
		if( err ) log.error( err );
		else log.info( stats.toString() );
		resolve();
	} );
} ) );

gulp.task( 'watch:server', () => new Promise( resolve => {
	const compiler = webpack( require( './webpack.config.js' ).serverConfig );
	compiler.watch( {}, ( err, stats ) => {
		if( err ) log.error( err );
		else log.info( stats.toString() );
		resolve();
	} );
} ) );

gulp.task( 'watch', gulp.parallel( 'watch:client', 'watch:server' ) );

gulp.task( 'default', gulp.series( 'clean', 'build' ) );

gulp.task( 'server:nodemon', () => {
	nodemon( {
		script: './dist/server.js',
		watch: [ './dist/*.js' ],
		nodeArgs: [ '--inspect' ],
		ext: 'js'
	} );
} );

gulp.task( 'server:browsersync', () => {
	browserSync.init( {
		ghostMode: false,
		localOnly: false,
		open: ( process.env.HEADLESS || '' ).toLowerCase() !== 'true',
		port: 8000,
		proxy: {
			target: 'http://localhost:8080',
			ws: true
		}
	} );

	gulp.watch( [ 'dist/www/**/*' ] ).on( 'change', browserSync.reload );
} );

gulp.task( 'server', gulp.series(  'watch', gulp.parallel( 'server:nodemon', 'server:browsersync' ) ) );

gulp.task( 'deploy', () =>
	gulp.src( [
		'package.json',
		'yarn.lock',
		'dist/**/*'
	], { base: '.' } )
	.pipe( ghPages( {
		branch: 'openshift',
		remote: 'origin'
	} ) )
);
