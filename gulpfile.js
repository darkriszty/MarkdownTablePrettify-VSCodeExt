var gulp = require("gulp");

gulp.task("copy-systemTest-resources", function() {
    return gulp
            .src("test/systemTests/resources/*")
            .pipe(gulp.dest("out/test/systemTests/resources"));
});