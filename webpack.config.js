const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
  mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
  context: `${__dirname}/src`,
  entry: {
    bundle: './entry.js',
  },
  output: {
    path: `${__dirname}/docs`,
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      { test: /\.html$/, loader: 'html-loader' },
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      { test: /\.(png|jpg)$/, exclude: /icons/, loader: 'file-loader?name=images/[name].[ext]&publicPath=../' },
      { test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?name=fonts/[name].[ext]&publicPath=../' },
      { test: /icons\/.+.(png|svg|xml|ico)/, loader: 'file-loader?name=icons/[name].[ext]' },
    ],
  },
  resolve: {
    extensions: ['.html', '.js', '.json', '.scss', '.css'],
  },
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      chunkFilename: 'styles/[name].css',
    }),
    new CopyWebpackPlugin([
      { from: 'manifest.json', to: 'manifest.json' },
      { from: 'data/japan.topojson', to: 'jsons/', context: '../' },
      { from: 'data/japan_prefs.topojson', to: 'jsons/', context: '../' },
      { from: 'data/saigai_densyo.json', to: 'jsons/', context: '../' },
      { from: 'icons/*.png', to: './', context: '../' },
      { from: 'icons/*.ico', to: './', context: '../' },
      { from: 'icons/*.xml', to: './', context: '../' },
      { from: 'icons/*.svg', to: './', context: '../' },
    ]),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new GenerateSW({
      swDest: 'sw.js',
      cacheId: 'densyo',
      clientsClaim: true,
      skipWaiting: true,
      directoryIndex: 'index.html',
    }),
  ],
  serve: {
    content: `${__dirname}/docs`,
    compress: true,
    host: 'localhost',
    port: 9000,
    dev: { publicPath: '/bousai_densyo_map/' },
    open: {
      path: '/bousai_densyo_map/',
    },
    hot: {
      host: 'localhost',
      port: 9010,
    },
  },
};
