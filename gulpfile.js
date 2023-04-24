"use strict"

const { src, dest } = require("gulp")
const gulp = require("gulp")
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')
const imagemin = require('gulp-imagemin')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const rename = require('gulp-rename')
const rigger = require('gulp-rigger')
const sass = require('gulp-sass')(require('sass'))
const removeComments = require('gulp-strip-css-comments')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
var gcmq = require('gulp-group-css-media-queries')
const del = require('del')
const browserSync = require('browser-sync').create()
const csscomb = require('gulp-csscomb')

// Paths
const srcPath = "src/"
const distPath = "dist/"

const path = {
	build: {
		html: distPath,
		css: distPath + "css/",
		js: distPath + "js/",
		images: distPath + "images/",
		fonts: distPath + "fonts/",
		libs: distPath + "libs/",
	},
	src: {
		html: srcPath + "*.html",
		css: srcPath + "scss/index.scss",
		// css: srcPath + "scss/**/*.scss",
		buildCss: srcPath + "scss/index.scss",
		js: srcPath + "js/**/*.js",
		jsBuild: srcPath + "js/index.js",
		images: srcPath + "images/**/*.{jpg,jpeg,png,svg,gif,ico,webp,webmanifest,xml,json}",
		fonts: srcPath + "fonts/**/*.{eot,woff,woff2,ttf,svg}",
		libs: srcPath + "libs/**/*.*",
	},
	watch: {
		html: srcPath + "**/*.html",
		css: srcPath + "scss/**/*.scss",
		js: srcPath + "js/**/*.js",
		images: srcPath + "images/**/*.{jpg,jpeg,png,svg,gif,ico,webp,webmanifest,xml,json}",
		fonts: srcPath + "fonts/**/*.{eot,woff,woff2,ttf,svg}",
		libs: srcPath + "libs/**/*.*",
	},
	// clean: "./" + distPath,
	clean: "./" + distPath + "**/*.*",
}

function serve() {
	browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    });
}

function html() {
	return src(path.src.html, { base: srcPath })
		.pipe(plumber())
		.pipe(dest(path.build.html))
		.pipe(browserSync.reload({stream: true}))
}

function css() {
	return src(path.src.css, { base: srcPath + "scss/" })
		.pipe(sourcemaps.init())
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: "SCSS Error",
					message: "Error: <%= error.message %>"
				})(err);
				this.emit('end')
			}
		}))
		.pipe(sass())
		.pipe(rename({
			suffix: ".min",
			extname: ".css",
		}))
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ["last 3 versions"],
			cascade: false
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(path.build.css))
		.pipe(browserSync.reload({stream: true}))
}

function cssBuild() {
	return src(path.src.buildCss, { base: srcPath + "scss/"})
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: "SCSS Error",
					message: "Error: <%= error.message %>"
				})(err);
				this.emit('end')
			}
		}))
		.pipe(sass())
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ["last 3 versions"],
			cascade: false
		}))
		.pipe(gcmq())
		.pipe(csscomb())
		.pipe(dest(path.build.css))
		.pipe(cssnano({
			zindex: false,
			discardComments: {
				removeAll: true,
			}
		}))
		.pipe(removeComments())
		.pipe(rename({
			suffix: ".min",
			extname: ".css",
		}))
		.pipe(dest(path.build.css))
		.pipe(browserSync.reload({stream: true}))
}

function js() {
	return src(path.src.js, { base: srcPath + "js/" })
		.pipe(sourcemaps.init())
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: "JS Error",
					message: "Error: <%= error.message %>"
				})(err);
				this.emit('end')
			}
		}))
		.pipe(rigger())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min",
			extname: ".js",
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(path.build.js))
		.pipe(browserSync.reload({stream: true}))
}

function jsBuild() {
	return src(path.src.jsBuild, { base: srcPath + "js/" })
		.pipe(plumber({
			errorHandler: function(err) {
				notify.onError({
					title: "JS Error",
					message: "Error: <%= error.message %>"
				})(err);
				this.emit('end')
			}
		}))
		.pipe(rigger())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min",
			extname: ".js",
		}))
		.pipe(dest(path.build.js))
		.pipe(browserSync.reload({stream: true}))
}

function images() {
	return src(path.src.images, { base: srcPath + "images/" })
		.pipe(imagemin([
				imagemin.gifsicle({interlaced: true}),
				imagemin.mozjpeg({quality: 80, progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
					plugins: [
						{removeViewBox: true},
						{cleanupIDs: false}
					]
				})
			]))
		.pipe(dest(path.build.images))
		.pipe(browserSync.reload({stream: true}))
}

function fonts() {
	return src(path.src.fonts, { base: srcPath + "fonts/" })
		.pipe(dest(path.build.fonts))
		.pipe(browserSync.reload({stream: true}))
}

function libs() {
	return src(path.src.libs, { base: srcPath + "libs/" })
		.pipe(dest(path.build.libs))
		.pipe(browserSync.reload({stream: true}))
}

function clean() {
	// return del([path.clean, '!' + path.clean + '.git/**/*.*'])
	return del(path.clean)
}

function watchFiles() {
	gulp.watch([path.watch.html], html)
	gulp.watch([path.watch.css], css)
	gulp.watch([path.watch.js], js)
	gulp.watch([path.watch.images], images)
	gulp.watch([path.watch.fonts], fonts)
	gulp.watch([path.watch.libs], libs)
}

const build = gulp.series(clean, gulp.parallel(html, cssBuild, jsBuild, images, fonts, libs))
const buildDev = gulp.series(clean, gulp.parallel(html, css, js, images, fonts, libs))
const watch = gulp.parallel(buildDev, watchFiles, serve)

exports.html = html
exports.css = css
exports.js = js
exports.images = images
exports.fonts = fonts
exports.clean = clean
exports.libs = libs
exports.cssBuild = cssBuild
exports.jsBuild = jsBuild
exports.buildDev = buildDev
exports.build = build
exports.watch = watch
exports.default = watch

// Для разработки в консоли: gulp
// Для сборки в консоли: gulp build