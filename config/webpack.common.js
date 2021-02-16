const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const mainSetup = require('./mainSetup');

module.exports = {
  entry: {
    main: ['babel-polyfill', path.resolve(__dirname, '../src', 'index.js')],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  devServer: {
    host: '127.0.0.1',
    port: 8089,
    historyApiFallback: true,
    overlay: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: 'assets/img/[name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: true,
                },
                optipng: {
                  optimizationLevel: 7,
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4,
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader?name=fonts/fonts/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover',
      },
      cache: false,
      template: './public/index.html',
      filename: 'index.html',
      projectId: mainSetup.projectId,
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, '../src'), 'node_modules'],
    extensions: ['.js', '.jsx'],
  },
}
