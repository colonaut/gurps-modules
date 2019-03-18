const path = require('path');
//const webpack = require('webpack');

//TODO: refactor to use vendor in dev, but only build and deploy actual app code. come up with a clean up after build

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, './packages'),
    entry: {
        app: './subscription_overview_app/src/index.js',
        module: './subscription_overview_module/src/index.js',
        vendor: './../vendor/index.js' //TODO: all vendor code must go here
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 4444
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.mjs$/, //needed for graphql package's .mjs rules (dunno when they fix it)
                include: /node_modules/,
                type: "javascript/auto",
            }
        ]
    }
};
