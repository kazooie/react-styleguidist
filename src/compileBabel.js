var path = require('path');
var webpack = require('webpack');

var webpackConfig = {
    entry: [
        path.join(__dirname, 'babel-standalone.js')
    ],
    output: {
        path: 'lib',
        filename: 'babel-standalone.js'
    },
    resolve: {
        root: path.join(__dirname),
        extensions: ['', '.js', '.jsx', '.json'],
        modulesDirectories: [
            path.resolve(__dirname, '../node_modules'),
            'node_modules'
        ]
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
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                query: {
                    "presets": ["es2015", "react", "stage-0"]
                }
            }
        ]
    },
    node: {
        fs: 'empty',
        module: 'empty',
        net: 'empty'
    }
};

module.exports = function(callback) {
    webpack(webpackConfig, function(err, stats) {
        callback(err, stats);
    });
};
