const gulp = require('gulp'); // Task runner
const browserSync = require('browser-sync').create(); // Sync on browser after functions
const sass = require('gulp-sass'); // Convert sass file to css files
const plumber = require('gulp-plumber'); // Handling errors
const postcss = require('gulp-postcss'); // Required for tailwind, also has bunch of plugins like autoprefixer (used for other browsers)
const tailwindcss = require('tailwindcss'); // CSS framework
const cssnano = require('gulp-cssnano'); // Minify css files
const purgecss = require('gulp-purgecss'); // Delete classes that are not used in html files
const concat = require('gulp-concat'); // To combine all js or css files into one
const rename = require('gulp-rename'); // Rename before copying to dist

/* -------------------------------------------------------------------------- */
/*                              CSS DEPENDENCIES                              */
/* -------------------------------------------------------------------------- */

// Copy only used tailwind dep css from src to dist
gulp.task('copy-tailwind-dep', function () {
	gulp.src('./tailwind-src.css')
		.pipe(plumber())
		.pipe(postcss([tailwindcss('./tailwind.config.js'), require('autoprefixer')]))
		.pipe(rename('./tailwind.css'))
		.pipe(gulp.dest('./'))
		.pipe(
			purgecss({
				content: ['src/**/*.html'],
			})
		)
		.pipe(cssnano())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

/* -------------------------------------------------------------------------- */
/*                              CSS DEPENDENCIES                              */
/* -------------------------------------------------------------------------- */

// Copy only used tailwind dep css from src to dist
gulp.task('copy-tailwind-css', function () {
	gulp.src('./tailwind.css')
		.pipe(
			purgecss({
				content: ['src/**/*.html'],
			})
		)
		.pipe(cssnano())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

/* -------------------------------------------------------------------------- */
/*                                  JS FILES                                  */
/* -------------------------------------------------------------------------- */

//Copy js files from src/js to dist/js
gulp.task('copy-js-files', function () {
	gulp.src(['src/js/common.js', 'src/js/index.js'])
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream());
});

/* -------------------------------------------------------------------------- */
/*                                 HTML FILES                                 */
/* -------------------------------------------------------------------------- */

// Copy html files to from src/ to dist/
gulp.task('copy-html-files', function () {
	gulp.src('src/*.html').pipe(gulp.dest('dist')).pipe(browserSync.stream());
});

/* -------------------------------------------------------------------------- */
/*                                 IMAGE FILES                                */
/* -------------------------------------------------------------------------- */

// copy image files from src/img to dist/img
gulp.task('copy-img-files', function () {
	gulp.src('src/images/*').pipe(gulp.dest('dist/images')).pipe(browserSync.stream());
});

/* -------------------------------------------------------------------------- */
/*                                 SASS FILES                                 */
/* -------------------------------------------------------------------------- */

// copy, compile and optimize scss files from src/scss to css/app.css
gulp.task('copy-scss-files', function () {
	gulp.src('src/scss/app.scss').pipe(plumber()).pipe(sass()).pipe(cssnano()).pipe(concat('main.css')).pipe(gulp.dest('dist/css')).pipe(browserSync.stream());
});

/* -------------------------------------------------------------------------- */
/*                             WATCHING ALL FILES                             */
/* -------------------------------------------------------------------------- */

gulp.task('watch-all', function () {
	browserSync.init({
		server: './dist',
	});

	gulp.watch('./tailwind.config.js', ['copy-tailwind-dep']);
	gulp.watch('./tailwind-src.css', ['copy-tailwind-dep']);
	gulp.watch('src/*.html', ['copy-html-files', 'copy-tailwind-css']);
	gulp.watch('src/scss/**/*.scss', ['copy-scss-files']);
	gulp.watch('src/js/*.js', ['copy-js-files']);
	gulp.watch('src/images/*', ['copy-img-files']);
});

/* -------------------------------------------------------------------------- */
/*                                TASKS RUNNING                               */
/* -------------------------------------------------------------------------- */

gulp.task('default', ['copy-tailwind-dep', 'copy-html-files', 'copy-scss-files', 'copy-js-files', 'copy-img-files', 'watch-all']);
