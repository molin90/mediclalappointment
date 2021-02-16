const merge = require('webpack-merge');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RenameWebpackPlugin = require('rename-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');
const OfflinePlugin = require('offline-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CopyPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(css|.scss)/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer(),
              ],
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: false,
  },
  output: {
    publicPath: '//www.mediclalappointment.com/',
    filename: 'assets/[name][hash:8].js',
    chunkFilename: 'assets/[id][hash:8].js',
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, '../dist')], {
      root: process.cwd(),
      verbose: true,
      dry: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[hash:8].css',
      chunkFilename: 'styles/[id].[hash:8].css',
    }),
    new OptimizeCssAssetsPlugin(),
    new CopyPlugin([
      { from: 'src/commonStyles/fonts.css', to: 'styles/' },
      { from: 'src/assets/web/favicon.ico', to: '' },
      { from: 'src/assets', to: 'assets' },
      { from: 'assets', to: 'assets' },
      { from: 'public/api', to: 'api' },
      { from: 'config/pages/urlLibrary.json', to: '' },
      { from: 'public/panel', to: 'panel' },
      { from: 'public/.htaccess', to: '' },
      { from: 'public/index.php', to: '' },
      { from: 'public/php.ini', to: '' },
    ]),
    new RenameWebpackPlugin({
      originNameReg: 'index.html',
      targetName: 'initapp.html',
    }),
    new OfflinePlugin({
      ServiceWorker: {
        publicPath: 'https://www.mediclalappointment.com/sw.js',
      },
      relativePaths: true,
      publicPath: '',
      responseStrategy: 'network-first',
      autoUpdate: 1000 * 60 * 60 * 0.15,
      excludes: [
        'api/**',
        'assets/archivo/**',
        'assets/imagen/**',
        'admin/**',
        '.htaccess',
        'initapp.html',
      ],
      caches: 'all',
      // Removes warning for about `additional` section usage
      safeToUseOptionalCaches: true,
    }),
    new WebpackPwaManifest({
      name: 'IES Arroyo Hondo',
      short_name: 'IES AH',
      description: '',
      background_color: '#435955',
      theme_color: '#FFF',
      display: 'standalone',
      fingerprints: false,
      publicPath: '/',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: path.resolve('src/assets/web/pwaLogo.png'),
          size: [512, 368, 192, 180, 167, 152, 144, 128, 114, 72, 57],
        },
      ],
    }),
  ],
});
