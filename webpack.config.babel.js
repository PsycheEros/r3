import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import webpack from 'webpack';
import { merge } from 'lodash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { AngularCompilerPlugin } from '@ngtools/webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CleanObsoleteChunksPlugin from 'webpack-clean-obsolete-chunks';
import PreloadWebpackPlugin from 'preload-webpack-plugin';
import yargs from 'yargs';
import uuid from 'uuid/v4';

import yaml from 'js-yaml';

const config = yaml.safeLoad( fs.readFileSync( path.resolve( 'webpack.yaml' ) ) );
const argv =
	yargs
	.options( {
		prod: {
			alias: 'p',
			boolean: true,
			coerce: v => v || undefined,
			conflicts: 'dev',
			type: 'boolean'
		},
		dev: {
			alias: 'd',
			boolean: true,
			coerce: v => v || undefined,
			conflicts: 'prod'
		}
	} )
	.argv;

const devMode =
	argv.dev ? true
:	argv.prod ? false
:  ( String( process.env.CI || '' ).toLowerCase() === 'true' ) ? false
:	config.devMode;


const mode = devMode ? 'development' : 'production';

merge( config.options.postcss, {
	plugins: Object.entries( config.options.postcss.plugins )
			.map( ( [ name, options ] ) => require( name )( options ) )
} );

const loader = {
	angular: { loader: '@ngtools/webpack' },
	babelClient: { loader: 'babel-loader' },
	babelServer: { loader: 'babel-loader' },
	css: { loader: 'css-loader' },
	debug: { loader: 'debug-loader' },
	file: { loader: 'file-loader' },
	html: { loader: 'html-loader' },
	raw: { loader: 'raw-loader' },
	null: { loader: 'null-loader' },
	postcss: { loader: 'postcss-loader' },
	optimizer: { loader: '@angular-devkit/build-optimizer/webpack-loader' },
	style: { loader: MiniCssExtractPlugin.loader },
	text: { loader: 'text-loader' },
	tslint: { loader: 'tslint-loader' },
	typescript: { loader: 'awesome-typescript-loader' },
	url: { loader: 'url-loader' },
	yaml: { loader: 'js-yaml-loader' }
};

for( const [ key, obj ] of Object.entries( loader ) ) {
	if( !obj.options ) obj.options = config.options[ key ] || {};
}

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

const buildId = crypto.createHash('md5').update(uuid()).digest('base64').replace( /=+$/, '' );

const env = {
	'process.env.DEBUG': JSON.stringify( devMode ),
	'process.env.NODE_ENV': JSON.stringify( mode ),
	BUILD_ID: JSON.stringify( buildId )
};

/** @type {webpack.Configuration} */
export const clientConfig = merge( {}, config.configuration.client, { mode, resolve }, /** @type {webpack.Configuration} */ {
	entry: {
		client: path.resolve( __dirname, 'src', 'client', 'main' )
	},
	module: {
		rules: [
			{ test: /\.ts$/i, include: [ path.resolve( __dirname, 'src', 'client' ) ], exclude: [ /\.ng\w+\./ ], enforce: 'pre', use: [ loader.tslint ] },
			{ test: /\.glb$/i, use: [ loader.file ] },
			{ test: /\.html$/i, use: [ loader.html ] },
			{ test: /\.s?css$/i, include: [ path.resolve( __dirname, 'src', 'client' ) ], oneOf: [
				{ test: angularPattern, use: [ loader.text ] },
				{ use: [ loader.style, loader.css ] }
			] },
			{ test: /\.css$/i, use: [ loader.postcss ] },
			{ test: /\.(?:png|jpe?g|gif|svg|woff\d*|[ot]tf|eot)/i, use: [ loader.file ] },
			{ test: /\.ya?ml$/i, use: [ loader.yaml ] },
			{ test: /\.[jt]s$/i, include: [ path.resolve( __dirname, 'src' ) ], use: [ loader.optimizer, loader.babelClient ] },
			{ test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/i, use: [ loader.angular ] }
		]
	},
	output: {
		path: path.resolve( __dirname, ...config.configuration.client.output.path )
	},
	plugins: [
		new AngularCompilerPlugin( config.options.angular ),
		new MiniCssExtractPlugin( { filename: '[hash].css' } ),
		new webpack.DefinePlugin( {
			'process.browser': JSON.stringify( true ),
			'process.platform': JSON.stringify( 'browser' ),
			...env
		} ),
		new webpack.ProvidePlugin(  {
			jQuery: 'jquery',
			$: 'jquery',
			Popper: [ 'popper.js', 'default' ],
			THREE: 'three'
		} ),
		new HtmlWebpackPlugin( {
			favicon: path.resolve( __dirname, 'assets', 'logo.png' ),
			inject: 'body',
			inlineSource: /^runtime~/,
			template: path.resolve( __dirname, 'src', 'client', 'index.ejs' ),
			templateParameters: {
				...config.templateParameters,
				buildId,
				hash: file =>
					crypto.createHash( 'md5' )
					.update( fs.readFileSync( path.join( __dirname, file ) ) )
					.digest( 'hex' )
			}
		} ),
		new PreloadWebpackPlugin( {
			include: 'allAssets',
			rel: 'prefetch',
			fileBlacklist: [ /icons-/, /\.(?:json|map|xml)/ ],
			as: source =>
				/\.(?:mp3|opus|wav)/i.test( source ) ? 'audio'
			:	/\.(?:glb|gltf)/i.test( source ) ? 'fetch'
			:	/\.(?:eof|otf|ttf|woff\d*)/i.test( source ) ? 'font'
			:	/\.(?:gif|jpe?g|png)/i.test( source ) ? 'image'
			:	/\.(?:js)/i.test( source ) ? 'script'
			:	/\.(?:css)/i.test( source ) ? 'style'
			:	null
		} ),
		new ScriptExtHtmlWebpackPlugin( {
			defaultAttribute: 'async'
		} ),
		new HtmlWebpackInlineSourcePlugin,
		...( devMode ? [
			new CleanObsoleteChunksPlugin
		] : [
			new BundleAnalyzerPlugin( {
				analyzerMode: 'static',
				reportFilename: path.resolve( __dirname, 'stats', 'client.html' )
			} )
		] )
	]
} );

/** @type {webpack.Configuration} */
export const serverConfig = merge( {}, config.configuration.server, { mode, resolve }, /** @type {webpack.Configuration} */ {
	entry: {
		server: path.resolve( __dirname, 'src', 'server', devMode ? 'main' : 'start' )
	},
	module: {
		rules: [
			{ test: /\.ts$/i, include: [ path.resolve( __dirname, 'src' ) ], exclude: [ path.resolve( __dirname, 'src', 'client' ) ], enforce: 'pre', use: [ loader.tslint ] },
			{ test: /\.ya?ml$/i, use: [ loader.yaml ] },
			{ test: /\.[jt]s$/i, include: [ path.resolve( __dirname, 'src' ) ], use: [ loader.babelServer ] },
			{ test: /\.ts$/i, use: [ loader.typescript ] }
		]
	},
	output: {
		path: path.resolve( __dirname, ...config.configuration.server.output.path )
	},
	externals: [
		nodeExternals( {
			modulesFromFile: {
				exclude: [ 'devDependencies' ]
			}
		} )
	],
	plugins: [
		new webpack.DefinePlugin( {
			...env
		} ),
		...( devMode ? [] : [
			new BundleAnalyzerPlugin( {
				analyzerMode: 'static',
				reportFilename: path.resolve( __dirname, 'stats', 'server.html' )
			} )
		] )
	]
} );

export default [ clientConfig, serverConfig ];
