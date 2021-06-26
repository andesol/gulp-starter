const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

// compile scss into css
function buildCSS() {
  return src('./src/scss/**/*.scss')
    .pipe(sass({ includePaths: ['./node_modules'] }))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(dest('./dist'))
    .pipe(browserSync.stream());
}

const minifyCSS = () => {
  return src('./dist/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(sourcemaps.write())
    .pipe(dest('./dist'));
};

const minifyJS = () => {
  return src('src/**/*.js')
    .pipe(uglify())
    .pipe(dest('dist'));
};

const copyHTML = () => {
  return src('./src/*.html').pipe(dest('./dist'));
};

const copyJS = () => {
  return src('./src/js/*.js').pipe(dest('./dist'));
};

function watchFiles() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
  watch('./src/scss/**/*.scss', buildCSS);
  watch('./src/*.html', copyHTML);
  watch('./src/js/**/*.js', copyJS);
  watch('./dist/*').on('change', browserSync.reload);
}

exports.build = parallel(copyHTML, series(buildCSS, minifyCSS), minifyJS);

exports.serve = series(parallel(buildCSS, copyHTML, copyJS), watchFiles);
