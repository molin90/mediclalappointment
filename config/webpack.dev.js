const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

const mapStyle = process.env.MAP_STYLE === 'true';

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 8089,
    historyApiFallback: true,
    overlay: true,
    open: true,
    stats: 'errors-only',
  },
  module: {
    rules: [
      {
        test: /\.(css|.scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: mapStyle ? 'css-loader?sourceMap' : 'css-loader' },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      { from: 'assets', to: 'assets' },
      { from: 'public/api', to: 'api' },
      { from: 'src/assets', to: 'assets' },
    ]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
});
