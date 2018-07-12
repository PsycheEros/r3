require( 'source-map-support/register' );
process.traceDeprecation = true;
require( '@babel/register' )( {
	babelrc: false,
	compact: false,
	presets: [
		[ '@babel/preset-env', {
			targets: {
				node: 'current'
			},
			useBuiltIns: 'usage'
		} ],
		'@babel/preset-stage-3'
	],
	sourceMap: true
} );
