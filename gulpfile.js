
var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('lint', function() {
    return gulp.src([ '**/*.js', '!node_modules/**', '!coverage/**' ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('default', [ 'lint' ]);
gulp.task('development', [ 'lint' ]);
gulp.task('test', [ 'lint' ]);
gulp.task('beta', [ 'lint' ]);
gulp.task('production', [ 'lint' ]);
