"use strict";

const gulp         = require("gulp"),
      sass         = require("gulp-sass"),
      plumber      = require("gulp-plumber"),
      postcss      = require("gulp-postcss"),
      autoprefixer = require("autoprefixer"),
      server       = require("browser-sync").create(),
      minify       = require("gulp-csso"),
      rename       = require("gulp-rename"),
      imagemin     = require("gulp-imagemin"),
      svgmin       = require("gulp-svgmin"),
      run          = require("run-sequence"),
      del          = require("del");

gulp.task("style", function() {
  gulp.src("./source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: [
          "last 2 versions"
        ]})
    ]))
    .pipe(gulp.dest("./build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("./build/css"));
    server.reload();
});

gulp.task("server", function() {
  server.init({
    server: "./build",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("./source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("./source/*.html", ["html:update"]);
});

gulp.task("html:copy", function() {
  return gulp.src("./source/*.html")
    .pipe(gulp.dest("./build/"));
});

gulp.task("html:update", ["html:copy"], function(done) {
  server.reload();
  done();
});

gulp.task("images", function() {
  const img = gulp.src("build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("build/img"));
  const svg = gulp.src("build/img/**/**.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("build/img"));
});

gulp.task("build", function(fn) {
  run("clean", "copy", "style", "images", fn);
});

gulp.task("copy", function() {
  return gulp.src([
    "./source/fonts/**/*.{woff,woff2}",
    "./source/img/**",
    "./source/*.html"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("./build/"));
});

gulp.task("clean", function() {
  return del("build");
});
