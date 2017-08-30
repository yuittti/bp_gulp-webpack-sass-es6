var path = require('path');
var webpack = require('webpack');

var config = {
	// entry: './src/js/main.js',
	output: {
		path: path.resolve(__dirname, 'js'),
		filename: 'main.js',
		publicPath: '/'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{ test: /\.(js)$/, use: 'babel-loader' },
		]
	}
};

module.exports = config;
