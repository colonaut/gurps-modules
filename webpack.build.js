const path = require('path');
const fs = require('fs');

const PATH_PACKAGES = path.resolve(__dirname, './packages');
const PACKAGE_SRC_ENTRIES = {};
fs.readdirSync(PATH_PACKAGES).forEach((name) => {
    let src_entry = `./${name}/src/index.js`;
    if (fs.existsSync(path.join(PATH_PACKAGES, src_entry)))
        return PACKAGE_SRC_ENTRIES[name] = `./${name}/src/index.js`;
});

//TODO: the vendor should go in one file..... but that'S for later
module.exports = {
    context: PATH_PACKAGES,
    /*entry: {
        react: './react/src/index.js',
        core: './core/src/index.js'
    },*/
    entry: PACKAGE_SRC_ENTRIES,
    output: {
        path: PATH_PACKAGES,
        filename: '[name]/lib/[name].js',
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};