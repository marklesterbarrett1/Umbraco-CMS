const gulp = require('gulp'),
    fs = require('fs'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    jslint = require('gulp-jslint'),

    jsFiles = [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery-validation/dist/jquery.validate.min.js',
        'node_modules/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'src/js/cookie-consent.js'
    ],

    sheets = [
        {
            src: 'src/scss/site.scss',
            dist: 'css/',
            name: 'site.css'
        }
    ];

let json = JSON.parse(fs.readFileSync('package.json'));

// Error notification settings for plumber
var plumberErrorHandler = {
    errorHandler: notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>"
    })
};

// Web Styles
gulp.task('styles', function (done) {
    sheets.map(function (file) {
        return gulp.src([
            file.src
        ])
            .pipe(sourcemaps.init())
            .pipe(plumber(plumberErrorHandler))
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(postcss([autoprefixer(json.browserslist)]))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(file.dist));
        //    .pipe(browserSync.stream({ match: '**/*.css' }));
    });
    done();
});


// JSlint
gulp.task('JSlint', function () {
    return gulp.src(jsFiles)
        .pipe(plumber(plumberErrorHandler))
        .pipe(jslint());
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(jsFiles)
        .pipe(plumber(plumberErrorHandler))
        .pipe(concat('site.js'))
        .pipe(gulp.dest('scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('scripts'));

});

// Watch
gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('src/js/**/*.js', gulp.series('JSlint', 'scripts'));
});

gulp.task('default', gulp.series('watch'));
