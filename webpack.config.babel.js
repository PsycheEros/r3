import fs from 'fs';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { AngularCompilerPlugin } from '@ngtools/webpack';
import { PurifyPlugin } from '@angular-devkit/build-optimizer';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import SriPlugin from 'webpack-subresource-integrity';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';

import yaml from 'js-yaml';

const config = yaml.safeLoad( fs.readFileSync( path.resolve( 'webpack.yaml' ) ) );
const mode = config.devMode ? 'development' : 'production';

const postCssOptions = { ...config.options.postcss,
	plugins: Object.entries( config.options.postcss.plugins ).map( ( [ name, options ] ) => require( name )( options ) )
};

const loader = {
	angular: { loader: '@ngtools/webpack' },
	babelClient: { loader: 'babel-loader' },
	babelServer: { loader: 'babel-loader' },
	css: { loader: 'css-loader' },
	file: { loader: 'file-loader' },
	html: { loader: 'html-loader' },
	raw: { loader: 'raw-loader' },
	null: { loader: 'null-loader' },
	postcss: { loader: 'postcss-loader', options: postCssOptions },
	babelPre: { loader: 'babel-loader' },
	optimizer: { loader: '@angular-devkit/build-optimizer/webpack-loader' },
	sass: { loader: 'sass-loader' },
	style: { loader: 'style-loader' },
	text: { loader: 'text-loader' },
	tslint: { loader: 'tslint-loader' },
	typescript: { loader: 'awesome-typescript-loader' },
	url: { loader: 'url-loader' },
	yaml: { loader: 'yaml-loader' }
};

for( const [ key, obj ] of Object.entries( loader ) ) {
	if( !obj.options ) obj.options = config.options[ key ] || {};
}

const devtool = config.devMode ? 'source-map' : 'none';

const output = {
	path: path.resolve( __dirname, 'dist' )
};

const resolve = {
	alias: {
		client: path.resolve( __dirname, 'src', 'client' ),
		data: path.resolve( __dirname, 'src', 'data' ),
		server: path.resolve( __dirname, 'src', 'server' ),
		src: path.resolve( __dirname, 'src')
	},
	extensions: [ '.ts', '.js', '.json' ]
};

const angularPattern = /\.(?:ng)?(?:component|directive|factory|pipe|module|service|style)\./i

const env = {
	'process.env.DEBUG': JSON.stringify( config.devMode ),
	'process.env.NODE_ENV': JSON.stringify( mode )
};

export default /** @type {webpack.Configuration[]} */ ( [ {
	devtool,
	entry: {
		client: 'client/main'
	},
	module: {
		rules: [
			{ test: /\.ts$/i, include: [ path.resolve( __dirname, 'src', 'client' ) ], exclude: [ /\.ng\w+\./ ], enforce: 'pre', use: [ loader.tslint ] },
			{ test: /\.html$/i, use: [ loader.html ] },
			{ test: /\.s?css$/i, include: [ path.resolve( __dirname, 'src', 'client' ) ], oneOf: [
				{ test: angularPattern, use: [ loader.text ] },
				{ use: [ loader.style, loader.css ] }
			] },
			{ test: /\.s?css$/i, use: [ loader.postcss ] },
			{ test: /\.scss$/i, use: [ loader.sass ] },
			{ test: /\.(?:png|jpe?g|gif|svg|woff\d*|[ot]tf|eot)/i, use: [ loader.file ] },
			{ test: /\.ya?ml$/i, use: [ loader.yaml ], type: 'json' },
			{ test: /\.[jt]s$/i, include: [ path.resolve( __dirname, 'src' ) ], use: [ loader.optimizer, loader.babelClient ] },
			{ test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/i, use: [ loader.angular ] }
		]
	},
	mode,
	optimization: {
		splitChunks: {
			chunks: 'all'
		},
		runtimeChunk: true
	},
	node: {
		fs: 'empty',
		global: true
	},
	output: {
		path: path.resolve( __dirname, 'dist', 'www' )
	},
	plugins: [
		new PurifyPlugin,
		new AngularCompilerPlugin( config.options.angular ),
		new webpack.DefinePlugin( {
			'process.browser': JSON.stringify( true ),
			'process.platform': JSON.stringify( 'browser' ),
			...env
		} ),
		new webpack.ProvidePlugin(  {
			jQuery: 'jquery',
			$: 'jquery',
			Popper: [ 'popper.js', 'default' ]
		} ),
		new HtmlWebpackPlugin( {
			inject: 'body',
			inlineSource: /^runtime~/,
			template: path.resolve( __dirname, 'src', 'client', 'index.html' ),
			xhtml: true
		} ),
		new ScriptExtHtmlWebpackPlugin( {
			defaultAttribute: 'async'
		} ),
		new SriPlugin( {
			hashFuncNames: [ 'sha256' ],
			enabled: true
		} ),
		new HtmlWebpackInlineSourcePlugin
	],
	resolve
}, {
	devtool,
	entry: {
		server: 'server/start'
	},
	module: {
		rules: [
			{ test: /\.ts$/i, include: [ path.resolve( __dirname, 'src' ) ], exclude: [ path.resolve( __dirname, 'src', 'client' ) ], enforce: 'pre', use: [ loader.tslint ] },
			{ test: /\.ya?ml$/i, use: [ loader.yaml ], type: 'json' },
			{ test: /\.[jt]s$/i, include: [ path.resolve( __dirname, 'src' ) ], use: [ loader.babelServer ] },
			{ test: /\.ts$/i, use: [ loader.typescript ] }
		]
	},
	mode,
	node: false,
	output,
	target: 'node',
	externals: [
		nodeExternals( {
			modulesFromFile: {
				include: [ 'dependencies' ]
			}
		} )
	],
	plugins: [
		new webpack.DefinePlugin( {
			...env
		} )
	],
	resolve
} ] );
