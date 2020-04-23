"use strict";

let gulp = require("gulp"),
    plumber = require("gulp-plumber"),
    prefixer = require("gulp-autoprefixer"),
    sass = require("gulp-sass"),
    rimraf = require("rimraf"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

let path = {
    build: {
      html: "build/",
      css: "build/css/",
      js: "build/js",
      images: "build/images/",
      fonts: "build/fonts/"
    },

    src: {
      html: "src/*.html",
      scss: "src/scss/*.scss",
      js: "src/js/*.js",
      images: "src/images/**/*.*",
      fonts: "src/fonts/**/*.*"
    },

    watch: {
      html: "src/**/*.html",
      scss: "src/scss/**/*.scss",
      js: "src/js/**/*.js",
      images: "src/images/**/*.*",
      fonts: "src/fonts/**/*.*"
    },

    clean: "./build"
};

let config = {
    server: {
      baseDir: "./build"
    },
    host: "localhost",
    port: 5000
};

function htmlBuild() {
  return gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream:true}));
}

function cssBuild() {
  return gulp.src(path.src.scss)
        .pipe(plumber())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream:true}));
}

function jsBuild() {
  return gulp.src(path.src.js)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream:true}));
}

function imagesBuild() {
  return gulp.src(path.src.images)
        .pipe(gulp.dest(path.build.images))
        .pipe(reload({stream:true}));
}

function fontsBuild() {
  return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream:true}))
}

function watcher() {
  gulp.watch([path.watch.html], {readDelay: 10}, gulp.series(htmlBuild)),
  gulp.watch([path.watch.scss], {readDelay: 10}, gulp.series(cssBuild)),
  gulp.watch([path.watch.js], {readDelay: 10}, gulp.series(jsBuild)),
  gulp.watch([path.watch.images], gulp.series(imagesBuild)),
  gulp.watch([path.watch.fonts], gulp.series(fontsBuild));
}

function webserver() {
  browserSync(config);
}

function clean(cb) {
  rimraf(path.clean, cb)
}


exports.htmlBuild = htmlBuild;
exports.cssBuild = cssBuild;
exports.jsBuild = jsBuild;
exports.imagesBuild = imagesBuild;
exports.fontsBuild = fontsBuild;
exports.watcher = watcher;
exports.webserver = webserver;
exports.clean = clean;

function build(cb) {
  gulp.series(clean, gulp.parallel(clean, htmlBuild, cssBuild, jsBuild, imagesBuild, fontsBuild))(cb);
}

exports.build = build;
exports.default = gulp.series(build, gulp.parallel(watcher, webserver));