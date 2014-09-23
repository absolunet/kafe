var gulp = require('gulp');
var deploy = require('gulp-gh-pages');

gulp.task('deploy-docs', function () {
    gulp.src('./doc/**/*')
        .pipe(deploy());
});