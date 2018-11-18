'use strict';

var gulp = require('gulp'),
    pug = require('gulp-pug'), // Припроцесор HTML
    browserSync = require('browser-sync'),// Серсер для обновлення і синхронізації сторінки
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),// плагін для побудови карт в scss і js
    uglify = require('gulp-uglifyjs'),
    //cssnano = require('gulp-cssnano'),
    //rename = require('gulp-rename'),
    del = require('del'),  // для видалення попок файлів
    //imagemin = require('gulp-imagemin'),
    //pngquant = require('imagemin-pngquant'),
    sass = require('gulp-sass'),
    cache = require('gulp-cache'),
    //spritesmith = require("gulp.spritesmith"),
    plumber = require("gulp-plumber"), // щоб ловити помилки в потоці
    notify = require("gulp-notify"),
    //newer = require("gulp-newer"),
    autoprefixer = require('gulp-autoprefixer');// плагін для css добаляє префікси до різних браузерів

var way = {
    "root": "./public",
    "theme": "frontend/pug/pages/*.pug",
    "style": "frontend/style/main.scss",
    "image": "frontend/image/**/*.*"
};

//бібліотеки які нам потрібні і всі js файли
var js = [
    'frontend/js/libs/jquery-3.1.1.min.js'
];

// Стилі
gulp.task('scss', function () {
    return gulp.src([
            way.style
        ])
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: "Style",
                    message: "Message to the notifier: " + err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer(['last 2 version']))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(way.root + "/style"));
    /*.pipe(browsersync.reload({
     stream: true
     }))*/
    ;
});

// Работа с Pug
gulp.task('pug', function () {
    return gulp.src(way.theme)
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .on("error", notify.onError(function (error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(gulp.dest(way.root));
});

// JS
gulp.task('scripts', function () {
    return gulp.src(js)
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(way.root + '/js'));
        // .pipe(browsersync.reload({
        //   stream: true
        // }));
});

//image
gulp.task('image',function (){
    return gulp.src(way.image)
        .pipe(gulp.dest(way.root + '/image'));
})

gulp.task("server", function () {
    browserSync.init({
        server: way.root
    });

    browserSync.watch(way.root + "/**/*.*").on("change", browserSync.reload);
});

// Видалення кешу
gulp.task('clearCache', function () {
    return cache.clearAll();
});

// Видалення папик
gulp.task("clear", function () {
    return del(way.root);
});

gulp.task("watch", function () {
    gulp.watch("frontend/style/**/*.scss", gulp.series("scss"));
    gulp.watch("frontend/js/**/*.js", gulp.series("scripts"));
    gulp.watch("frontend/pug/**/*.pug", gulp.series("pug"));
    gulp.watch("frontend/image/**/*.svg", gulp.series("image"));
});

gulp.task("build", gulp.series("pug", "scss", "scripts","image"));

gulp.task("default", gulp.series("clear", "build", gulp.parallel("watch", "server")))


