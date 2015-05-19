'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

//var customNotifier = $.notify.withReporter(function (options, callback) {
//  //console.log(options);
//  callback();
//});

gulp.task('styles', function () {
  return gulp.src('htdocs/{modules,themes}/**/*.scss', { base: 'htdocs' })
    // Process only changed files
    .pipe($.changed('htdocs', { extension: '.css' }))
    // Catch any errors to prevent them from crashing gulp
    .pipe($.plumber($.notify.onError({title: '<%= error.plugin %>'})))
    // Start source maps processing
    .pipe($.sourcemaps.init())
    // Convert scss to css
    // @todo Adjust include path to include the active Drupal theme
    .pipe($.sass({
      outputStyle: 'expanded',
      includePaths: ['.']
    }))
    // Generate browser prefixes
    .pipe($.autoprefixer('last 3 versions'))
    // Beautfy css style
    //.pipe($.csscomb('htdocs/.csscomb.json'))
    // Lint css using Drupal rules
    .pipe($.csslint('htdocs/.csslintrc'))
    // @todo Custom reporter to $.notify() user if any problems
    .pipe($.csslint.reporter())
    // Write source maps
    .pipe($.sourcemaps.write())
    // Stop error handling
    .pipe($.plumber.stop())
    // Write to destination
    .pipe(gulp.dest('htdocs'))
    // Push to livereload
    .pipe($.livereload());
});

gulp.task('scripts', function () {
  return gulp.src('htdocs/{modules,themes}/**/*.js', { base: 'htdocs' })
    // Process only changed files
    .pipe($.changed('htdocs'))
    // Push to livereload
    .pipe($.livereload())
    // Lint javascript using Drupal rules
    .pipe($.eslint())
    // @todo Custom reporter to $.notify() user if any problems
    .pipe($.eslint.format());
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

gulp.task('watch', function () {
  $.livereload.listen();

  // Watch for modifications and run tasks
  gulp.watch('htdocs/{modules,themes}/**/*.scss', ['styles']);
  gulp.watch('htdocs/{modules,themes}/**/*.js', ['scripts']);
  //gulp.watch('htdocs/{modules,themes}/**/*.{png,jpg,jpeg,gif}', ['images']);
});

gulp.task('clean', function (done) {
  //gulp.src('htdocs/{modules,themes}/**/*.scss', { read: false, base: 'htdocs' })
  //  @todo Delete generated .css files, but no other
  //  .pipe();
  //return $.cache.clearAll(done);
});

gulp.task('default', ['styles', 'scripts'/*, 'images'*/], function () {
  gulp.start('watch');
});
