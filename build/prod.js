const { merge } = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const common = require("./common");

const prod = {
  mode: "production",
  devtool: "nosources-source-map",
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [new TerserWebpackPlugin(), new CssMinimizerWebpackPlugin()],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "public/favicon.ico", to: "favicon.ico" }],
    }),
  ],
};

module.exports = merge(common, prod);
