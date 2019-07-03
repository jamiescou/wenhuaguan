var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ?  config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}


/*
 * @Author: Cy
 */

var glob = require('glob');

/**
 * 获取入口文件
 * @param {String} globPath  入口目录
 * @param {Object} excludePattern   排除文件夹的正则表达式，可空
 * @returns JSON
 */
exports.getEntries = function (globPath, excludePattern) {
  var files = glob.sync(globPath);
  var entries = {};
  let entry;
  for (let i = 0; i < files.length; i++) {
    entry = files[i];

    // !!一般用来将后面的表达式强制转换为布尔类型的数据（boolean），也就是只能是true或者false;
    // var isNpmModule = !!path.match(/node_modules/); // 路径中含有 node_modules 的就不去解析。
    if (excludePattern && excludePattern.exec(entry)) continue;

    // 绝对路径
    let filename = entry.substring(entry.lastIndexOf('/') + 1, entry.lastIndexOf('.'));
    entries[filename] = entry;
  }
  return entries;
};
