const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	entry: './source/client/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bungle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					'eslint-loader',
					'babel-loader'
				]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader'
				]
			}
		]
	},
	plugins: [
		//new webpack.optimize.UglifyJsPlugin(),
		new HtmlWebpackPlugin({template: './source/client/index.html'})
	]
};
