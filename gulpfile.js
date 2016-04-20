'use strict';

var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  lost = require('lost'),
  autoprefixer = require('autoprefixer'),
  lazypipe = require('lazypipe'),
  // @todo Rename production server environment variable ;)
  is_production = process.env.COMPASS_PRODUCTION === 'true',
  path = require('path'),
  theme_path = path.join(__dirname, 'htdocs', 'themes', 'MYTHEME');

gulp.task('styles', function () {

  var csslintTasks = lazypipe()
    // @todo Custom reporter to $.notify() user if any problems
    .pipe($.csslint, 'htdocs/.csslintrc')
    .pipe($.csslint.reporter);

  return gulp.src(path.join(theme_path, 'less', 'style.less'))
    // Catch any errors to prevent them from crashing gulp
    .pipe($.plumber({
      errorHandler: $.notify.onError({
        message: 'Error: <%= error.message %>',
        title: '<%= error.plugin %>'
      })
    }))
    //.pipe($.debug())
    // Start source maps processing
    .pipe($.if(!is_production, $.sourcemaps.init()))
    // Convert scss to css
    .pipe($.less({
      paths: [ theme_path, 'less' ]
    }))
    .pipe($.postcss([
      lost(),
      autoprefixer({
        browsers: ['> 1% in DE', '> 1% in AT', '> 1% in CH', 'last 2 versions', 'Firefox ESR']
      })]
    ))
    // Write source maps
    .pipe($.if(!is_production, $.sourcemaps.write()))
    // Lint css using Drupal rules
    // @todo Find a way to not use linting on bootstrap css
    //.pipe($.if(!is_production, csslintTasks()))
    // Write to destination
    .pipe(gulp.dest(path.join(theme_path, 'css')))
    // Push to livereload
    .pipe($.if(!is_production, $.livereload()));
});

gulp.task('scripts', function () {

  var eslintTasks = lazypipe()
    // @todo Custom reporter to $.notify() user if any problems
    .pipe($.eslint)
    .pipe($.eslint.format);

  return gulp.src('htdocs/{modules,themes}/**/*.js', { base: 'htdocs' })
    // Filter out third-party and minified scripts before linting
    .pipe($.filter(['**/*', '!**/{contrib,vendor}/**', '!**/*.min.js']))
    // Catch any errors to prevent them from crashing gulp
    .pipe($.plumber({
      errorHandler: $.notify.onError({
        message: 'Error: <%= error.message %>',
        title: '<%= error.plugin %>'
      })
    }))
    .pipe($.uglify())
    .pipe($.rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('htdocs'))
    //.pipe($.if(!is_production, eslint()))
    // Push to livereload
    .pipe($.if(!is_production, $.livereload()));
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
  //gulp.start('scripts');
  //gulp.start('images');
});

gulp.task('watch', function () {
  $.livereload.listen();

  // Watch for modifications and run tasks
  gulp.watch('htdocs/{modules,themes}/**/*.less', ['styles']);
  //gulp.watch('htdocs/{modules,themes}/**/*.js', ['scripts']);
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
