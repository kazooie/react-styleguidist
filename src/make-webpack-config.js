var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Initial = require('postcss-initial');
var merge = require('webpack-merge');
var prettyjson = require('prettyjson');
var config = require('../src/utils/config');
var reactTransform = require('babel-plugin-react-transform');

function getPackagePath(packageName) {
	return path.dirname(require.resolve(packageName + '/package.json'));
}

module.exports = function(env) {
	var isProd = env === 'production';
	var cssLoader = 'css?modules&importLoaders=1&localIdentName=ReactStyleguidist-[name]__[local]!postcss';

	var codeMirrorPath = getPackagePath('codemirror');
	var reactTransformPath = getPackagePath('babel-plugin-react-transform');

	var includes = [
		__dirname,
		config.rootDir
	];
	var webpackConfig = {
		output: {
			path: config.styleguideDir,
			filename: 'build/bundle.js'
		},
		resolve: {
			root: __dirname,
			extensions: ['', '.js', '.jsx', '.json'],
			modulesDirectories: [
				path.resolve(__dirname, '../node_modules'),
				'node_modules'
			],
			alias: {
				'codemirror': codeMirrorPath
			}
		},
		resolveLoader: {
			root: path.join(__dirname, "../node_modules"),
			modulesDirectories: [
				path.resolve(__dirname, '../loaders'),
				path.resolve(__dirname, '../node_modules'),
				'node_modules'
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				title: config.title,
				template: config.template,
				inject: true
			}),
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify(env)
				}
			})
		],
		module: {
			loaders: [
				{
					test: /\.json$/,
					loader: 'json'
				},
				{
					test: /\.css$/,
					exclude: includes,
					loader: 'style!css'
				},
				{
					test: /\.css$/,
					include: includes,
					loader: 'style!' + cssLoader
				}
			],
			noParse: [
				/babel-standalone.js/
			]
		},
		postcss: function() {
			return [
				Initial({
					reset: 'inherited'
				})
			];
		}
	};

	var entryScript = path.join(__dirname, 'index');

	if (isProd) {
		webpackConfig = merge(webpackConfig, {
			entry: [
				entryScript
			],
			devtool: false,
			debug: false,
			cache: false,
			plugins: [
				new webpack.optimize.OccurenceOrderPlugin(),
				new webpack.optimize.DedupePlugin(),
				new webpack.optimize.UglifyJsPlugin({
					compress: {
						warnings: false
					},
					output: {
						comments: false
					},
					mangle: false
				})
			],
			module: {
				loaders: [
					{
						test: /\.jsx?$/,
						include: includes,
						loader: 'babel',
						query: {
							"presets": ["es2015", "react", "stage-0"]
						}
					}
				]
			}
		});
	}
	else {
		webpackConfig = merge(webpackConfig, {
			entry: [
				'webpack-hot-middleware/client',
				entryScript
			],
			debug: true,
			cache: true,
			devtool: 'eval-source-map',
			stats: {
				colors: true,
				reasons: true
			},
			plugins: [
				new webpack.HotModuleReplacementPlugin(),
				new webpack.NoErrorsPlugin()
			],
			module: {
				loaders: [
					{
						test: /\.jsx?$/,
						include: includes,
						loader: 'babel',
						query: {
							"presets": ["es2015", "react", "stage-0"],
							"plugins": [
								// must be an array with options object as second item
								[reactTransform, {
									// must be an array of objects
									"transforms": [{
										// can be an NPM module name or a local path
										"transform": "react-transform-hmr",
										// see transform docs for "imports" and "locals" dependencies
										"imports": ["react"],
										"locals": ["module"]
									}, {
										// you can have many transforms, not just one
										"transform": "react-transform-catch-errors",
										"imports": ["react", "redbox-react"]
									}]
								}]
							]
						}
					}
				]
			}
		});
	}

	if (config.updateWebpackConfig) {
		webpackConfig = config.updateWebpackConfig(webpackConfig, env);
	}

	if (config.verbose) {
		console.log();
		console.log('Using Webpack config:');
		console.log(prettyjson.render(webpackConfig));
		console.log();
	}

	return webpackConfig;
};
