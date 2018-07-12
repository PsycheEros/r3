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

gulp.task( 'clean', () => del( [ 'dist' ] ) );

gulp.task( 'build', async () => {
	const compiler = webpack( require( './webpack.config.js' ).default );
	const stats = await new Promise( ( resolve, reject ) => {
		compiler.run( ( err, stats ) => {
			if( err ) reject( new Error( err ) );
			else resolve( stats );
		} );
	} );
	log.info( stats.toString() );
} );

gulp.task( 'watch', async () => {
	const compiler = webpack( require( './webpack.config.js' ).default );
	compiler.watch( {}, ( err, stats ) => {
		if( err ) log.error( err );
		else log.info( stats.toString() );
	} );
} );

gulp.task( 'default', gulp.series( 'clean', 'build' ) );

gulp.task( 'server:nodemon', () => {
	nodemon( {
		script: './dist/server.js',
		watch: [ './dist/server.js' ],
		nodeArgs: [ '--inspect' ],
		ext: 'js'
	} );
} );

gulp.task( 'server:browsersync', () => {
	browserSync.init( {
		ghostMode: false,
		proxy: {
			target: 'http://localhost:3000',
			ws: true
		},
		port: 8000
	} );

	gulp.watch( [ 'dist/index.html', 'dist/client.js' ] ).on( 'change', browserSync.reload );
} );

gulp.task( 'server', gulp.parallel( 'watch', 'server:nodemon', 'server:browsersync' ) );
