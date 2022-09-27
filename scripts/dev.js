const webpack = require('webpack');
const { merge } = require('webpack-merge')
const common = require('./common')

const dev = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: './public',
    hot: 'only',
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:9000'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = merge(common, dev);
