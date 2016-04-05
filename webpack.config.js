'use strict';
/*eslint no-process-env:0*/

var path = require('path');
var Clean = require('clean-webpack-plugin');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var WSurl = require('./ws-detect');
var HomeUrl = '/tools/bubbles';


var config = {
  template: 'index.html',
  index: 'index.html',
  src: './client/src',
  dest: './client/dist/tools',
  publicPath: '/tools/'
};

var isProduction = process.env.NODE_ENV === 'production';

var absSrc = path.join(__dirname, config.src);
var absDest = path.join(__dirname, config.dest);
var wConfig = {
  debug: true,
  profile: true,
  cache: true,
  devtool: isProduction ? 'sourcemaps' : 'eval',
  context: path.join(__dirname, config.src),
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
    extensions: ['', '.js', 'json', '.png', '.gif', '.jpg']
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
        //loader: 'style!css'//?root=' + absSrc
      },
      {
        test: /.*\.(gif|png|jpe?g)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[path][name].[ext]',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
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
    new ExtractTextPlugin('[name]-[hash:6].css'),
    new HtmlWebpackPlugin({
      filename: config.index,
      template: path.join(config.src, config.template),
      chunks: ['angular', 'vizabi-tools'],
      minify: true
    }),
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: path.join(config.src, '404.html'),
      chunks: ['angular', 'vizabi-tools'],
      minify: true
    })
  ],
  pushPlugins: function () {
    if (!isProduction) {
      return;
    }

    console.log('Adding production plugins');
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
  stats: {colors: true, progress: true, children: false},
  devServer: {
    contentBase: config.dest,
    publicPath: config.publicPath,
    noInfo: true,
    hot: true,
    inline: true,
    historyApiFallback: {
      index: config.index,
      logger: console.log.bind(console),
      verbose: true,
      rewrites: [
        {
          from: /^\/$|^\/tools.*$/,
          to: function () {
            return '/tools/';
          }
        }
      ]
    },
    devtool: 'eval'
  }
};

wConfig.pushPlugins();

module.exports = wConfig;
