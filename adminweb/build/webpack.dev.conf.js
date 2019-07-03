var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var devConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: resolve('static/images/favicon.ico')
    }),
    new FriendlyErrorsPlugin()
  ]
})

// var pages = utils.getEntries(resolve('src/htmls/**/*.html'));
// for (var pathname in pages) {
//   var conf = {
//     filename: pathname + '.html',
//     template: pages[pathname], // 模板路径
//     chunks: [pathname, 'vendor', 'manifest'],
//     inject: true // js插入位置
//   };
//   // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
//   devConfig.plugins.push(new HtmlWebpackPlugin(conf));
// };


module.exports = devConfig;