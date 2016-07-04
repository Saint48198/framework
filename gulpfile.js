'use strict';

const gulp = require('gulp');
const del = require('del');
const tsc = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = tsc.createProject('tsconfig.json');
const tslint = require('gulp-tslint');
const connect = require('gulp-connect-php');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');

/**
 * Remove build directory.
 */
gulp.task('clean', () => {
	return del(['dist']);
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
	return gulp.src('src/**/*.ts')
		.pipe(tslint())
		.pipe(tslint.report('verbose'));
});

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task('compile', () => {
	const tsResult = gulp.src('src/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject));

	return tsResult.js
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});

/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task('copy:assets', () => {
	return gulp.src(['src/**/*', 'src/index.html', 'src/systemjs.config.js', '!**/*.ts', '!src/sass'])
		.pipe(gulp.dest('dist'));
});

/**
 * Copy all required libraries into build directory.
 */
gulp.task('copy:libs', () => {
	return gulp.src([
		'node_modules/**/*.js',
	])
		.pipe(gulp.dest('dist/lib'))
});

/**
 * SASS server
 */
gulp.task('sass', function () {
	console.log("Start SASS server...")
	return gulp.src('./src/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/app/css'));
});


/**
 * Watch for changes in TypeScript, HTML and CSS files.
 */
gulp.task('watch', function () {
	gulp.watch(['src/**/*.ts'], ['tslint', 'compile']).on('change', function (e) {
		console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
		browserSync.reload();
	});
	gulp.watch(['src/**/*.html', 'src/**/*.css', 'src/index.html', '**/*.php'], ['copy:assets']).on('change', function (e) {
		console.log('Resource file ' + e.path + ' has been changed. Updating.');
		browserSync.reload();
	});
	gulp.watch('src/sass/**/*.scss', ['sass']).on('change', function (e) {
		console.log('SASS file ' + e.path + ' has been changed. Updating.');
		browserSync.reload();
	});
});

/**
 * Build the project.
 */
gulp.task('build', (callback) => {
	console.log('Building the project ...')
	runSequence(
		'clean',
		'tslint',
		'compile',
		'copy:assets',
		'copy:libs',
		'sass',
		callback);
});

/**
 *  Start server php server and browser sync
 */

gulp.task('connect-sync', () => {
	connect.server({
		base: 'dist',
		port: 8001
	}, function (){
		browserSync({
			proxy: '127.0.0.1:8001',
			port: 8910
		});
	});
});

gulp.task('serve', () => {
	runSequence('build', 'connect-sync', ['watch']);
});