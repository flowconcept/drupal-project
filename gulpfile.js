'use strict';

var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  lost = require('lost'),
  autoprefixer = require('autoprefixer');

gulp.task('styles', function () {
  return gulp.src('htdocs/{modules,themes}/**/*.scss', { base: 'htdocs' })
    // Filter out third-party stylesheets and scss partials
    .pipe($.filter(['**/*', '!**/{contrib,vendor}/**', '!**/_*.scss']))
    // Catch any errors to prevent them from crashing gulp
    .pipe($.plumber({
      errorHandler: $.notify.onError({
        message: 'Error: <%= error.message %>',
        title: '<%= error.plugin %>'
      })
    }))
    //.pipe($.debug())
    // Start source maps processing
    .pipe($.sourcemaps.init())
    // Convert scss to css
    .pipe($.sass({
      outputStyle: 'expanded',
      // @todo Adjustable include path to the active Drupal theme
      includePaths: ['htdocs/themes/andechsernatur']
    }))
    .pipe($.postcss([
      lost(),
      autoprefixer({
        browsers: ['> 1% in DE', '> 1% in AT', '> 1% in CH', 'last 2 versions', 'Firefox ESR']
      })]
    ))
    // Write source maps
    .pipe($.sourcemaps.write())
    // Lint css using Drupal rules
    // @todo Custom reporter to $.notify() user if any problems
    .pipe($.csslint('htdocs/.csslintrc'))
    .pipe($.csslint.reporter())
    // Write to destination
    .pipe($.rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('htdocs'))
    // Push to livereload
    .pipe($.livereload());
});

gulp.task('scripts', function () {
  return gulp.src('htdocs/{modules,themes}/**/*.js', { base: 'htdocs' })
    // Push to livereload
    .pipe($.livereload())
    // Filter out third-party and minified scripts before linting
    .pipe($.filter(['**/*', '!**/{contrib,vendor}/**', '!**/*.min.js']))
    //.pipe($.debug())
    // @todo Custom reporter to $.notify() user if any problems
    .pipe($.eslint())
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

gulp.task('build', function () {
  gulp.start('styles');
  // Scripts are not built.
  //gulp.start('scripts');
  //gulp.start('images');
});

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

gulp.task('default', ['build'], function () {
  gulp.start('watch');
});
