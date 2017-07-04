var gulp = require('gulp');
var mustache = require("gulp-mustache");
var extname = require('gulp-extname');
var sass = require('gulp-sass');
var server = require('gulp-server-livereload');
var wait = require('gulp-wait');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');

gulp.task('build', ['clean'], function () {
  procMustache();
  procSass(true);
  procAssets();
  procJs();
});

gulp.task('watch', ['clean'], function () {
  procMustache();
  procSass();
  procAssets();
  procJs();
  gulp.watch('./src/scss/{,**/}*.{scss,sass}', ['sass']);
  gulp.watch('./src/templates/{,**/}*.{json,mustache}', ['mustache']);
  gulp.watch('./src/js/{,**/}*.*', ['js']);
  gulp.src('dist')
    .pipe(server({
      livereload: true,
      directoryListing: {
        enable: true,
        path: 'dist'
      },
      open: false
    }));
});

gulp.task('clean', function () {
  return gulp.src('./dist/*', { read: false })
    .pipe(clean());
});

gulp.task('sass', procSass);

gulp.task('mustache', procMustache);

gulp.task('js', procJs);

/**
 * Procesar templates
 */
function procMustache() {
  return gulp.src(['./src/templates/**/*.mustache', '!./templates/partials/**/*'])
    .pipe(mustache('./src/templates/data.json'))
    .pipe(extname('.html'))
    .pipe(gulp.dest('./dist'));
}

/**
 * Estilos
 */
function procSass(release = false) {
  if (release === true) {
    return gulp.src('./src/scss/**/*.scss')
      .pipe(wait(500))
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./dist/css'));
  } else {
    return gulp.src('./src/scss/**/*.scss')
      .pipe(wait(1000))
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/css'));
  }
}

/**
 * Recursos
 */
function procAssets() {
  gulp.src('./fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'));
  gulp.src('./images/**/*')
    .pipe(gulp.dest('./dist/images'));
}

/**
 * JS
 */
function procJs() {
  // Libs
  gulp.src('./node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('./dist/js'));
  gulp.src('./node_modules/dotdotdot/src/js/jquery.dotdotdot.min.js')
    .pipe(gulp.dest('./dist/js'));
  // Src
  gulp.src('./src/js/**/*')
    .pipe(gulp.dest('./dist/js'));
}