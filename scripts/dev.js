// const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./common');

const dev = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    // static: path.resolve(__dirname, '../public'),
    hot: 'only',
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:9000'
    }
  }
};

module.exports = merge(common, dev);
