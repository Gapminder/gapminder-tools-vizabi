'use strict';
/* eslint no-process-env:0 */

var path = require('path');
var Clean = require('clean-webpack-plugin');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var WSurl = require('./ws-detect')(process.env);
var HomeUrl = '/#_chart-type=bubbles';

var config = {
  template: 'index.html',
  index: 'index.html',
  src: './client/src',
  dest: './client/dist/tools/',
  publicPath: '/tools/'
};

var isProduction = process.env.NODE_ENV === 'production';

var absSrc = fromRoot(config.src);
var absDest = fromRoot(config.dest);
var wConfig = {
  debug: true,
  profile: true,
  cache: true,
  devtool: isProduction ? 'sourcemaps' : 'eval',
  context: absSrc,
  entry: {
    'vizabi-tools': './js/app.js',
    angular: ['angular', 'angular-route', 'angular-touch', 'd3']
  },
  output: {
    path: absDest,
    publicPath: config.publicPath,
    filename: 'components/[name]-[hash:6].js',
    chunkFilename: 'components/[name]-[hash:6].js'
  },
  resolve: {
    root: [absSrc],
    modulesDirectories: ['./components', 'node_modules'],
    extensions: ['', '.js', 'json', '.png', '.gif', '.jpg', '.cur']
  },
  module: {
    loaders: [
      {
        test: /vizabi\.js/,
        loader: 'imports?this=>window,d3'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {test: /\.styl$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')},
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap&root=' + absSrc)
        // loader: 'style!css'//?root=' + absSrc
      },
      {
        test: /.*\.(gif|png|jpe?g|cur)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[path][name].[ext]',
          'image-webpack?{progressive:true,optimizationLevel:7,interlaced:false,pngquant:{quality:"65-90",speed:4}}'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html?name=[path][name].[ext]&root=' + absSrc
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?name=[path][name].[ext]&limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream'
      },
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file?name=[path][name].[ext]'},
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml'
      }
    ]
  },
  plugins: [
    new Clean([config.dest]),
    new webpack.DefinePlugin({
      _isDev: !isProduction,
      // WS_SERVER is used also in Vizabi library, change this variable carefully
      WS_SERVER: JSON.stringify(WSurl),
      HOME_URL: JSON.stringify(HomeUrl)
    }),
    new ExtractTextPlugin('public/css/[name]-[hash:6].css'),
    new HtmlWebpackPlugin({
      filename: config.index,
      template: config.template,
      chunks: ['angular', 'vizabi-tools'],
      minify: {removeAttributeQuotes: true}
    }),
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: '404.html',
      chunks: ['angular', 'vizabi-tools'],
      minify: {removeAttributeQuotes: true}
    }),
    new CopyWebpackPlugin([
      {
        from: fromRoot('./node_modules/vizabi/build/dist/assets/translation'),
        to: fromRoot('./client/dist/tools/public/translation')
      }
    ])
  ],
  pushPlugins: function () {
    if (!isProduction) {
      return;
    }
    this.plugins.push.apply(this.plugins, [
      // production only
      new webpack.optimize.UglifyJsPlugin(),
      new CompressionPlugin({
        asset: '{file}.gz',
        algorithm: 'gzip',
        regExp: /\.js$|\.html$|\.css$|\.map$|\.woff$|\.woff2$|\.ttf$|\.eot$|\.svg$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]);
  },
  stats: {colors: true, progress: true, children: false}
};

function fromRoot(filepath) {
  return path.join(__dirname, filepath);
}

wConfig.pushPlugins();

module.exports = wConfig;
