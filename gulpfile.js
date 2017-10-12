var gulp = require("gulp");
var gutil = require("gulp-util");

gulp.task("copy-systemTest-resources", function() {
    return gulp
            .src("test/systemTests/resources/*")
            .pipe(gulp.dest("out/test/systemTests/resources"));
});