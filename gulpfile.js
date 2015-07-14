'use strict';
var gulp    = require('gulp');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');
var header  = require('gulp-header');
var espower = require('gulp-espower');
var mocha   = require('gulp-mocha');
var pkg     = require('./package.json');

var BANNER = '/*! <%= name %> / @version:<%= version %> @author:<%= author %> @license:<%= license %> */ \n';

gulp.task('uglify', function() {
    gulp.src(['src/simple-drawing-board.js', 'src/*.js'])
        .pipe(concat('simple-drawing-board.min.js'))
        .pipe(uglify({
            mangle: true,
            compress: {
                drop_console: true,
                drop_debugger: true,
            }
        }))
        .pipe(header(BANNER, pkg))
        .pipe(gulp.dest('dist/'));
});

gulp.task('test', function() {
    gulp.src(['_test/test.js'])
        .pipe(espower())
        .pipe(mocha());
});

gulp.task('default', ['test', 'uglify']);
