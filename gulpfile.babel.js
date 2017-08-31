'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import webpackStream from 'webpack-stream';
import webpack2 from 'webpack';
import autoprefixer from 'gulp-autoprefixer';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import watch from 'gulp-watch';
import sourcemaps from 'gulp-sourcemaps';
import shell from 'gulp-shell';
import rimraf from 'rimraf';
import del from 'del';
import ignore from 'gulp-ignore';
import browserSync from 'browser-sync';
import cssmin from 'gulp-minify-css';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';

const bs = browserSync.create();
const reload = bs.reload;

var path = {
	build: {
		style: 'css/',
		js: 'js/',
		sprite: 'images/',
		spriteName: '../images/sprite.png'
	},
	src:   {
		style: ['src/scss/**/*.scss'],
		js: ['src/js/*.js'],
		sprite: ['images/sprite-images/*.*']
	},
	watch: {
		style: 'src/scss/**/*.scss',
		js: ['src/js/*.js'],
		sprite: ['images/sprite-images/*.*']
	}
};

const onError = function(err) {
	notify.onError({
		title: `Gulp error in ${err.plugin}`,
		message: err.toString()
	})(err);
	this.emit('end');
};

gulp.task('webserver', function (cb) {
	bs.init({
		proxy: "localhost/projectName",
		browser: 'chromium-browser',
		// browser: 'firefox',
		socket: {
			domain: 'localhost:3000'
		},
		notify: {
	    styles: {
				top: 'auto',
				bottom: '0'
	    }
		},
		injectChanges: true
	});
});

gulp.task('clean', () => {
	del.sync([
		path.build.style,
		path.build.js
	]);
});

gulp.task('style:build', () => {
	return gulp.src(path.src.style)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({ browsers: ['ie >= 9', 'last 10 versions'] }))
		.pipe(cssmin())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.style))
		.pipe(bs.stream({match: "**/*.css"}));
});

gulp.task('images:copy', () => {
	gulp.src('images')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true }))
		.pipe(gulp.dest('images'));

	reload();
});

gulp.task('js:build', () => {
	return gulp.src(path.src.js)
		.pipe(webpackStream({
			entry: {
				main: './src/js/main.js'
			},
			output: {
				filename: 'main.js',
			},
			devtool: 'source-map',
			module: {
				rules: [
					{ test: /\.(js)$/, use: 'babel-loader' },
				]
			}
		}, webpack2))
		.pipe(gulp.dest(path.build.js))
		.pipe(bs.reload({match: "**/*.js"}));
});

gulp.task('build', [
	'clean',
	'style:build',
	'js:build'
	// 'images:copy'
]);

gulp.task('watch', () => {

	bs.watch(path.watch.style).on('change', (event, cb) => {
		gulp.start('style:build');
		// reload();
	});

	bs.watch(path.watch.js).on('change', (event, cb) => {
		gulp.start('js:build');
		// reload();
	});
});

gulp.task('default', ['webserver', 'build', 'watch' ]);
