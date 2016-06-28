var Promise = require('es6-promise').Promise;
// The above was necessary to fix compile-time errors: http://stackoverflow.com/a/35229818

var gulp        = require('gulp');
var harp        = require('harp')
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var deploy      = require('gulp-gh-pages');
var shell       = require('gulp-shell');

/**
 * Serve the Harp Site
 */
gulp.task('serve', function () {
  harp.server(__dirname, {
    port: 9500
  }, function () {
    browserSync({
      proxy: "localhost:9500",
      open: false,
      /* Hide the notification. It gets annoying */
      notify: {
        styles: ['opacity: 0', 'position: absolute']
      }
    });
    /**
     * Watch for sass changes, tell BrowserSync to refresh main.css
     */
    gulp.watch("public/**/*.scss", function () {
      reload("app.css", {stream: true});
    });
    /**
     * Watch for all other changes, reload the whole page
     */
    gulp.watch(["public/**/*.jade", "public/**/*.json", "public/**/*.md"], function () {
      reload();
    });
  })
});

/**
 * Serve the site in production
 */

gulp.task('production', function () {
  return gulp.src('')
    .pipe(shell([
      'NODE_ENV=production sudo harp server --port 80'
    ]))
});

/**
 * Build the Harp Site
 */
gulp.task('build', function () {
  return gulp.src('')
    .pipe(shell([
      'harp compile . dist'
    ]))
});

/**
 * Push build to gh-pages
 */
gulp.task('deploy', ['build'], function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});

/**
 * Default task, running `gulp` will fire up the Harp site,
 * launch BrowserSync & watch files.
 */
gulp.task('default', ['serve']);
