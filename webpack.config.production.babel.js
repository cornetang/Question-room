const path = require("path");
const webpack = require("webpack");

module.exports = {
	cache: true,
	entry: { bundle: path.join(__dirname, "src/js/index.jsx") },
	output: { filename: "[name].js" },
	resolve: { extensions: [ "", ".webpack.js", ".web.js", ".js", ".jsx" ] },
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(?!node_modules\/formsy\-react)node_modules/,
				loader: "babel?stage=0&optional[]=runtime"
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": { "NODE_ENV": JSON.stringify("production") }
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			mangle: true,
			minimize: true,
			compress: { warnings: false }
		}),
		new webpack.PrefetchPlugin("react"),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
			_: "lodash"
		})
	]
};
