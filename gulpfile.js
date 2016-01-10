var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var plumber = require('gulp-plumber');
var env = require('gulp-env');

gulp.task('nodemon', function () {
  env({
    file: '.env',
    type: 'ini'
  });

  nodemon({
    script: 'index.js',
    ignore: ['package.json', 'noode_modules', 'gulpfile.js', 'views', 'public']
  });
});

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init({
    proxy: 'http://localhost:8080',
    files: ['views/**/*'],
    notify: false,
    browser: 'google chrome canary'
  });
});

gulp.task('sass', function () {
  return gulp.src('src/style/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('public/style/'))
    .pipe(browserSync.stream());
});

gulp.task('coffee', function () {
  return gulp.src('src/script/app.coffee')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(gulp.dest('public/script/'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch('src/style/**/*.scss', ['sass']);
  gulp.watch('src/script/*.coffee', ['coffee']);
});

gulp.task('build', ['sass', 'coffee']);
