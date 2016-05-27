module.exports = (config) => {
    config.set({
        browsers: [ "Chrome" ],
        captureTimeout: 5000,
        singleRun: true,
        colors: true,
        frameworks: [ "mocha" ],
        plugins: [
                "karma-chrome-launcher", "karma-mocha", "karma-mocha-reporter",
                "karma-sourcemap-loader", "karma-webpack", "karma-coverage"
            ],
        files: [ { pattern: "test/tests.webpack.js"} ],
        webpack: {
            resolve: { extensions: [ "", ".js", ".jsx" ] },
            devtool: "inline-source-map",
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
        				exclude: /node_modules\//,
        				loader: "babel?stage=0&optional[]=runtime"
                    }
                ],
                postLoaders: [
                    {
                        test: /\.jsx?$/,
                        exclude: /(test|node_modules)\//,
                        loader: "istanbul-instrumenter"
                    }
                ]
            }
        },
        webpackServer: { noInfo: true },
        preprocessors: {
                "test/tests.webpack.js": [ "webpack", "sourcemap" ]
            },
        reporters: [ "mocha", "progress", "coverage" ],
        coverageReporter: {
            instrumenterOptions: {
                isparta: { babel: { stage: 0 } }
            },
            type: "lcov", dir: "./coverage/", subdir: "." }
    });
};
