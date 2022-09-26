const webpack = require('webpack');
const { merge } = require('webpack-merge')
const common = require('./common')

const dev = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: './public',
    open: true,
    hot: 'only',
    host: '0.0.0.0'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = merge(common, dev);