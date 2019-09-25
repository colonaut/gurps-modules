const path = require('path');
const fs = require('fs');

//TODO: refactor to use vendor in dev, but only build and deploy actual app code. come up with a clean up after build

const getPackageEntries = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(path.join(__dirname, './packages'), 'utf8', (err, package_names) => {
            if (err)
                return reject(err);

            const entry = package_names.reduce((acc, v) => {
                return Object.assign(acc, {
                    [v]: `./${v}/src/index.js`
                });
            }, {
                //vendor: './../vendor/index.js'
            });

            return resolve(entry);
        });
    });
};

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, './packages'),
    entry: () => getPackageEntries(),
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
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader',
            },
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
