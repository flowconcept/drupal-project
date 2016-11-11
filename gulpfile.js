'use strict';

var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  autoprefixer = require('autoprefixer'),
  lazypipe = require('lazypipe'),
  reporter = require("postcss-reporter"),
  // @todo Rename production server environment variable ;)
  isProduction = process.env.COMPASS_PRODUCTION === 'true',
  themePath = 'htdocs/themes/vanity';


// Common gulp-plumber error handler options
var plumberOptions = {
  errorHandler: $.notify.onError({
    message: 'Error: <%- error.message %>',
    title: '<%- error.plugin %>'
  })
};


// Sass pipeline
var sassTasks = lazypipe()
  //.pipe($.debug)
  .pipe(function() { return $.if(!isProduction, $.sourcemaps.init()); })
  .pipe($.sass, {
    outputStyle: 'expanded',
    includePaths: [themePath + '/sass']
  })
  .pipe($.postcss, [
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
  // Store compiled bootstrap styles in separate directory
  return gulp.src(themePath + '/sass/*.scss')
    // Filter out partials
    .pipe($.filter(['**/*', '!_*.scss']))
    .pipe($.plumber(plumberOptions))
    .pipe(sassTasks())
    .pipe(gulp.dest(themePath + '/css'))
    .pipe($.if(!isProduction, $.livereload()));
});


gulp.task('styles:modules', function () {

  return gulp.src('htdocs/modules/**/*.scss', { base: 'htdocs' })
    // Filter out third-party stylesheets and scss partials
    .pipe($.filter(['**/*', '!**/{contrib,vendor}/**', '!**/_*.scss']))
    .pipe($.plumber(plumberOptions))
    .pipe(sassTasks())
    .pipe($.rename({
      extname: '.css'
    }))
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
    .pipe($.filter(['**/*', '!**/vendor/**', '!**/*.min.js']))
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
  gulp.watch('htdocs/themes/custom/**/*.scss', ['styles:theme']);
  gulp.watch('htdocs/modules/custom/**/*.scss', ['styles:modules']);
  gulp.watch(scriptsGlob, ['scripts']);
  //gulp.watch('htdocs/{modules,themes}/**/*.{png,jpg,jpeg,gif}', ['images']);
});

gulp.task('default', ['build', 'watch']);
