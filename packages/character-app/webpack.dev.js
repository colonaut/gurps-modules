const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const port = Math.round(Math.random() * 10000);
console.log('port', port);

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: [path.join(__dirname, 'public')],
    compress: true,
    port: 9002
  }
});