const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const minifyCss = require('gulp-minify-css');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

// 작업 경로 설정
const devSrc = 'src';
const devPaths = {
    js: devSrc + '/js/**/*.js',  // 추후 js폴더 밑에 다른 폴더가 생성되더라도 하위 js를 모두 적용
    css: devSrc + '/sass/**/*.scss',
    html : devSrc + '/**/*.html',
    images: devSrc + '/sass/images/**/*.png'
};

// 결과물 경로 설정
const buildSrc = 'build';

// gulp.task 를 사용하여 task를 추가한다. gulp.task('테스크명', function (){ return  })
gulp.task('copy:js', function () {
    return gulp.src(devPaths.js)
        /*.pipe(concat('index.js'))*/
        /*.pipe(uglify())*/
        .pipe(gulp.dest(buildSrc + '/js'));
});

gulp.task('copy:css', function () {
    return gulp.src(devPaths.css)
        .pipe(concat('tetris.css'))
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(gulp.dest(buildSrc + '/css'));
});

gulp.task('copy:images', function () {
   return gulp.src(devPaths.images)
       .pipe(imagemin())
       .pipe(gulp.dest(buildSrc + '/css/images'));
});

gulp.task('copy:html', function () {
    return gulp.src(devPaths.html)
        .pipe(gulp.dest(buildSrc));
});

gulp.task('watch', function () {
    gulp.watch(devPaths.html, ['copy:html']);
    gulp.watch(devPaths.css, ['copy:css']);
    gulp.watch(devPaths.js, ['copy:js']);
    gulp.watch(devPaths.images, ['copy:images']);
});

gulp.task('webpack', function (callback) {
    var myConfig = Object.create(webpackConfig);
    myConfig.plugins = [
        new webpack.optimize.DedupePlugin()
    ];

    // run webpack
    webpack(myConfig, function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({
            colors: true,
            progress: true
        }));
        callback();
    });
});