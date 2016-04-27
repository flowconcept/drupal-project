'use strict';

var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  lost = require('lost'),
  autoprefixer = require('autoprefixer'),
  lazypipe = require('lazypipe'),
  reporter = require("postcss-reporter"),
  // @todo Rename production server environment variable ;)
  isProduction = process.env.COMPASS_PRODUCTION === 'true',
  themePath = 'htdocs/themes/empfehlung';


// Common gulp-plumber error handler options
var plumberOptions = {
  errorHandler: $.notify.onError({
    message: 'Error: <%- error.message %>',
    title: '<%- error.plugin %>'
  })
};


// LESS pipeline
var lessTasks = lazypipe()
  //.pipe($.debug)
  .pipe(function() { return $.if(!isProduction, $.sourcemaps.init()); })
  .pipe($.less, { paths: [themePath + '/less'] })
  .pipe($.postcss, [
    lost(),
    autoprefixer({
      browsers: ['> 1% in DE', '> 1% in AT', '> 1% in CH', 'last 2 versions']
    }),
    reporter({ clearMessages: true })
  ])
  .pipe(function() { return $.if(!isProduction, $.sourcemaps.write()); })
  // @todo Find a way to not use linting on bootstrap css
  //.pipe(function() { return $.if(!isProduction, $.csslint('htdocs/.csslintrc')); })
  .pipe(function() { return $.if(!isProduction, $.csslint.reporter()); });


gulp.task('styles:theme', function() {
  // Store compiled bootstrap subtheme styles in separate directory
  return gulp.src(themePath + '/less/style.less')
    .pipe($.plumber(plumberOptions))
    .pipe(lessTasks())
    .pipe(gulp.dest(themePath + '/css'))
    .pipe($.if(!isProduction, $.livereload()));
});


gulp.task('styles:modules', function() {
  // Store compiled custom modules styles alongside LESS files
  return gulp.src('htdocs/modules/custom/**/*.less', { base: 'htdocs' })
    .pipe($.plumber(plumberOptions))
    .pipe(lessTasks())
    .pipe(gulp.dest('htdocs'))
    .pipe($.if(!isProduction, $.livereload()));
});


var scriptsGlob = [
  themePath + '/js/**/*.js',
  'htdocs/modules/custom/**/*.js'
];

gulp.task('scripts', function() {
  // Store compiled custom modules scripts alongside their source files
  return gulp.src(scriptsGlob, { base: 'htdocs' })
    // Exclude third-party and minified scripts
    .pipe($.filter(['**/*', '!**/{contrib,vendor}/**', '!**/*.min.js']))
    .pipe($.plumber(plumberOptions))
    //.pipe($.debug())
    .pipe($.uglify())
    //.pipe($.if(!isProduction, $.eslint()))
    .pipe($.if(!isProduction, $.eslint.format()))
    .pipe($.rename({ extname: '.min.js' }))
    .pipe(gulp.dest('htdocs'))
    .pipe($.if(!isProduction, $.livereload()));
});


//gulp.task('images', function () {
//  return gulp.src('htdocs/{modules,themes}/**/*.{png,jpg,jpeg,gif}', { base: 'htdocs' })
//    .pipe($.cache($.imagemin({
//      progressive: true,
//      interlaced: true,
//      svgoPlugins: [{removeViewBox: false}]
//    })))
//    .pipe(gulp.dest('htdocs'));
//});


gulp.task('build', ['styles:theme', 'styles:modules', 'scripts'/*, 'images'*/]);

gulp.task('watch', function() {
  $.livereload.listen();
  gulp.watch('htdocs/themes/**/*.less', ['styles:theme']);
  gulp.watch('htdocs/modules/custom/**/*.less', ['styles:modules']);
  gulp.watch(scriptsGlob, ['scripts']);
  //gulp.watch('htdocs/{modules,themes}/**/*.{png,jpg,jpeg,gif}', ['images']);
});

gulp.task('default', ['build', 'watch']);
