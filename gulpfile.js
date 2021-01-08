var gulp = require("gulp");
var merge = require("gulp-merge-json");

gulp.task("copy-systemTest-resources", function() {
    return gulp
            .src("test/systemTests/resources/*")
            .pipe(gulp.dest("out/test/systemTests/resources"));
});

gulp.task("merge-packagejson-for-npm-dist", function () {
    return gulp.src("package.*json")
        .pipe(merge({fileName: "package.json"}))
        .pipe(gulp.dest("out"));
});
