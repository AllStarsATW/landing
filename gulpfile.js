'use strict';

const gulp = require('gulp');
var debug = require('gulp-debug'); // Проверка работы задачи, конструкция .pipe(debug({title: 'название действия'}))
var prefix = require('gulp-autoprefixer');
var sourcemap = require('gulp-sourcemaps');
var gulpIf = require('gulp-if');

var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var rigger = require('gulp-rigger');
var reload = browserSync.reload;

var del = require('del');
var minCss = require('gulp-minify-css');
var uncss = require('gulp-uncss');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');



const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

var path = {
    prod: {
        baseDir: 'prod/',
        html: 'prod/content/',
        js: 'prod/js/',
        css: 'prod/css/',
        img: 'prod/images/',
        sources: 'prod/sources/',
        fonts: 'prod/fonts/'
    },
    dev: {
        baseDir: 'dev/',
        html: 'dev/content/',
        js: 'dev/js/',
        sass: 'dev/sass/',
        css: 'dev/css/',
        img: 'dev/images/',
        sources: 'dev/sources/',
        fonts: 'dev/fonts/'
    }
};

// Tasks for development
gulp.task('sass', function () {
    return gulp.src(path.dev.sass + '*.sass')
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return{
                    title: 'Sass',
                    message: err.message
                };
            })
        }))
        .pipe(gulpIf(isDevelopment, sourcemap.init()))
        .pipe(sass())
        .pipe(prefix('last 15 versions'))
        .pipe(gulpIf(isDevelopment, sourcemap.write()))
        .pipe(gulp.dest(path.dev.css))
        .pipe(browserSync.stream());

});

gulp.task('html', function () {
    return gulp.src(path.dev.html + '*.html')
        .pipe(rigger())
        .pipe(gulp.dest(path.dev.baseDir))
});

gulp.task('reload', function(done){
    browserSync.reload();
    done();
});
gulp.task('server', function () {
    browserSync.init({
        server: path.dev.baseDir
    });
    gulp.watch(path.dev.sass + '*.sass', gulp.series('sass'));
    gulp.watch(path.dev.html + '**/*.html', gulp.series('html','reload'));
    gulp.watch([path.dev.js + '**/*.*', path.dev.img + '**/*.*', path.dev.sources + '**/*.*', path.dev.fonts + '**/*.*']).on('change', browserSync.reload);
});


gulp.task('watch', gulp.parallel('server'));




// Tasks for building
gulp.task('clean', function () {
    return del(path.prod.baseDir);
});
gulp.task('html:build', function () {
    gulp.src(path.dev.baseDir + '*.html')
        .pipe(gulp.dest(path.prod.baseDir));
    return gulp.src(path.dev.html + '*.html')
        .pipe(gulp.dest(path.prod.html));

});
gulp.task('uncss', function () {
    return gulp.src(path.dev.css + 'main.css')
        .pipe(uncss({
            html: [path.dev.baseDir + '*.html', path.dev.html + '*.html']
        }))
        .pipe(gulp.dest(path.dev.css));
});
gulp.task('css:build', function () {
    return gulp.src(path.dev.css + '*.css')
        .pipe(minCss())
        .pipe(gulp.dest(path.prod.css));
});
gulp.task('js:build', function () {
    return gulp.src(path.dev.js + '*.js')
        .pipe(uglify())
        .pipe(gulp.dest(path.prod.js))
});
gulp.task('images:build', function () {
    return gulp.src(path.dev.img + '*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.prod.img))
});
gulp.task('fonts:build', function() {
    return gulp.src(path.dev.fonts + '**/*.*')
        .pipe(gulp.dest(path.prod.fonts))
});
gulp.task('sources:build', function() {
    return gulp.src(path.dev.sources  + '**/*.*')
        .pipe(gulp.dest(path.prod.sources))
});
gulp.task('build', gulp.series(
    'clean',
    'html:build',
    'js:build',
    'uncss',
    'css:build',
    'fonts:build',
    'images:build',
    'sources:build'
));


