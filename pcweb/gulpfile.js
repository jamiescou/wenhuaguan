const gulp = require('gulp');
const sass = require('gulp-sass'); // 编译 sass
const autoprefixer = require('gulp-autoprefixer'); // css 浏览器前缀补全
const rename = require('gulp-rename');
const sequence = require('gulp-sequence'); // sequence是为了让控制任务的执行顺序
const del = require('del'); // 删除文件
// const nodemon = require('gulp-nodemon');
// const browserSync = require('browser-sync');
// const reload = browserSync.reload;
const path = require('path');

function resolve(dir) {
  return path.resolve(__dirname, dir)
}
let config = {
  style: {
    cssDir: './public/styles/{base,components,pages}/*.scss',
    cssDestDir: './public/styles/',
    setting: {
      // outputStyle: 'compressed',
      outputStyle: 'compact',
      indentWidth: 0
    },
    autoprefixer: {
      browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
      cascade: false
    },
    rename: {
      dirname: '',
      suffix: '.min' // 加后缀
    }
  },
  clearDir: './public/{javascripts,styles}/*.*'
};

gulp.task('sass', function() {
  return gulp.src(resolve(config.style.cssDir))
    .pipe(sass.sync(config.style.setting).on('error', sass.logError))
    .pipe(autoprefixer(config.style.autoprefixer))
    .pipe(rename(config.style.rename))
    .pipe(gulp.dest(resolve(config.style.cssDestDir)));
});

//删除.tmp和dist下的所有文件 等同于 gulp.task('clean',function(){require('del')(['.tmp','dist'])});
gulp.task('clean', del.bind(null, resolve(config.clearDir), {
  force: true
}));

gulp.task('sass:watch', function() {
  gulp.watch(resolve(config.style.cssDir), ['sass']);
});

gulp.task('build:dev', sequence(['sass', 'sass:watch']));

gulp.task('default', ['clean'], function() {
  gulp.start('build:dev');
});

gulp.task('dist', sequence(['clean', 'sass']));
// gulp.task('dist', ['clean']);

// gulp.task('default', ['nodemon', 'sass'], function() {
//   gulp.watch([resolve(config.style.cssDir)], ['sass']);
// });

// gulp.task('nodemon', function(cb) {
//   var started = false;

//   return nodemon({
//     script: 'bin/www'
//   }).on('start', function() {
//     // to avoid nodemon being started multiple times
//     // thanks @matthisk
//     if (!started) {
//       cb();
//       started = true;
//     }
//   });
// });

// gulp.task('browser-sync', ['nodemon'], function() {
//   browserSync.init(null, {
//     // proxy: 'http://localhost:3003',
//     // files: ['public/**/*.*', 'views/**/*.*'],
//     browser: 'google chrome',
//     notify: false,
//     port: 3003
//   });
// });