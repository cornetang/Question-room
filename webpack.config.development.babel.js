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
				exclude: /node_modules/,
				loader: "babel?stage=0&optional[]=runtime"
			}
		]
	},
	devtool: "#source-map",
	plugins: [
		new webpack.DefinePlugin({
			"process.env": { "NODE_ENV": JSON.stringify("development") }
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
