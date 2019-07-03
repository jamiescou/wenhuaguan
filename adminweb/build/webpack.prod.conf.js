var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

// 生产环境的环境配置
var env = config.build.env

var webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
            'process.env': env
        }),
    new webpack.optimize.UglifyJsPlugin({
            // 最紧凑的输出
            beautify: false,
            compress: {
                warnings: false // 在UglifyJs删除没有用到的代码时不输出警告  
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                // drop_console: true
            },
            // 删除所有的注释
            comments: false,
            sourceMap: true
        }),
    // extract css into its own file
    new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,
      favicon: resolve('static/images/favicon.ico'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
    // copy custom static assets
    new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

// var pages = utils.getEntries(resolve('src/htmls/**/*.html'));
// for (var pathname in pages) {
//     // 配置生成的html文件，定义路径等
//     var conf = {
//         filename: pathname + '.html',
//         template: pages[pathname], // 模板路径    
//         chunks: [pathname, 'vendor', 'manifest'], // 每个html引用的js模块
//         inject: true, // js插入位置
//         minify: { // 压缩HTML文件
//             removeComments: true, // 移除HTML中的注释
//             collapseWhitespace: false, // 删除空白符与换行符
//             removeAttributeQuotes: true // 去除属性引用
//         },
//         chunksSortMode: 'dependency'
//     };
//     // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
//     webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
// };

module.exports = webpackConfig
