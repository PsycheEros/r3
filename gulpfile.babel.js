import gulp from 'gulp';
import del from 'del';
import log from 'gulplog';
import nodemon from 'nodemon';
import webpack from 'webpack';

const browserSync = require( 'browser-sync' ).create();

gulp.task( 'browsersync:reload', done => {
	browserSync.reload();
	done();
} );

gulp.task( 'clean', () => del( [ 'dist', 'stats' ] ) );

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
		else {
			err = stats.toString( 'errors-only' );
			if( err ) log.error( stats.toString() );
		}
		resolve();
	} );
} ) );

gulp.task( 'watch:server', () => new Promise( resolve => {
	const compiler = webpack( require( './webpack.config.js' ).serverConfig );
	compiler.watch( {}, ( err, stats ) => {
		if( err ) log.error( err );
		else {
			err = stats.toString( 'errors-only' );
			if( err ) log.error( stats.toString() );
		}
		resolve();
	} );
} ) );

gulp.task( 'watch', gulp.parallel( 'watch:client', 'watch:server' ) );

gulp.task( 'default', gulp.series( 'clean', 'build' ) );

gulp.task( 'server:nodemon', () => new Promise( resolve => {
	nodemon.once( 'start', () => { resolve(); } );

	nodemon( {
		script: './dist/server.js',
		watch: [ './dist/*.js' ],
		nodeArgs: [ '--inspect=0.0.0.0:9229' ],
		ext: 'js'
	} );
} ) );

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

gulp.task( 'server', gulp.series( gulp.parallel( 'watch:client', gulp.series( 'watch:server', 'server:nodemon' ) ), 'server:browsersync' ) );

gulp.task( 'server:server', gulp.series( 'watch:server', 'server:nodemon' ) );
