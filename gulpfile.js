
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');

gulp.task('lint', function() {
    return gulp.src(['**/*.js', '!node_modules/**', '!coverage/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('test', function() {
    return gulp.src(['test/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'spec', timeout: 5000 }));
});

gulp.task('default', ['test', 'lint']);
