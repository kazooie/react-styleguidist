var express = require('express');
var webpack = require('webpack');
var makeWebpackConfig = require('./make-webpack-config');
var config = require('./utils/config');

module.exports = function server(callback) {
	var app = express();
	var compiler = webpack(makeWebpackConfig('development'));

	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true
	}));

	app.use(require('webpack-hot-middleware')(compiler));

	app.use(express.static(config.rootDir));

	app.listen(config.serverPort, function(err) {
		callback(err, config);
	});
};
