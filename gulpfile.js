'use strict';

var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    open = require('open'),
    express = require('express'),
    jsonServer = require('json-server'),

    plumber = require('gulp-plumber'),

    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    riot = require('gulp-riot'),

    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),

    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),

    mocha = require('gulp-spawn-mocha');


function swallowError(err) {
  console.log(err);
  this.emit('end');
};

// Default task and watch configuration
gulp.task('default', function() {
  var process;

  // Restart when gulpfile changes
  function restart() {
    if (process) {
      process.kill();
      process = spawn('gulp', ['dev-tasks'], { stdio: 'inherit' });
    } else {
      // Only open browser on 1st startup
      process = spawn('gulp', ['dev-tasks', 'open'], { stdio: 'inherit' });
    }
  }

  gulp.watch('gulpfile.js', restart);
  restart();
});

// Collective tasks for production, development, test
gulp.task('production', ['jade', 'riot', 'javascript', 'sass', 'production-server']);
gulp.task('dev-tasks', ['jade', 'riot', 'javascript', 'sass', 'dev-server', 'watch']);
gulp.task('test', ['jade', 'riot', 'javascript', 'sass', 'test-server']);

// Watch for changes and recompile sass/jade/riot-tags
gulp.task('watch', function() {
  gulp.watch('./assets/sass/**/*.sass', ['sass']);
  gulp.watch('./assets/tags/*.tag', ['riot']);
  gulp.watch('./assets/js/**/*.js', ['javascript']);
  gulp.watch('./assets/jade/**/*.jade', ['jade']);
});

// Compile tags to javascript with riot compiler
gulp.task('riot', function() {
  return gulp.src('./assets/tags/*.tag')
    .pipe(plumber(swallowError))
    .pipe(riot({
      compact: true
    })).pipe(gulp.dest('./assets/js/tags'));
});

// Generate css via libsass
gulp.task('sass', function () {
  return gulp.src('./assets/sass/**/*.sass')
    .pipe(plumber(swallowError))
    .pipe(sass({
      indentedSyntax: true,
      errLogToConsole: true,
      includePaths: []
    }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('./dist/assets/css'));
});

// Bundle our javascript, convert es6 to es5
// Also: write sourcemaps for better understanding
gulp.task('javascript', function () {
  var bundle = browserify('./assets/js/index.js', { debug: true })
    .transform(babelify)
    .bundle();

  bundle
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/assets/js'));
});

// Compile jade to html
gulp.task('jade', function() {
  return gulp.src('./assets/jade/**/*.jade')
    .pipe(plumber(swallowError))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./dist'));
});

// Configure and run the express-server
function setupServer(environment) {
  var app = express(),
      router;

  app.use(express.static('./dist'));
  app.use(jsonServer.defaults());

  if (environment === 'test') {
    router = jsonServer.router('data/test/topics.json');
  } else {
    router = jsonServer.router('data/topics.json');
  }
  app.use('/api', router);

  if (environment === 'production') {
    return app.listen(process.env.PORT || 1337);
  } else {
    return app.listen(3001);
  }
}

gulp.task('dev-server', function() {
  setupServer('development');
});
gulp.task('test-server', function() {
  var server = setupServer('test');

  return gulp
    .src('test/*.js')
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        window: {}
      }
    }))
    .on('error', function() {
      server.close();
    })
    .on('end', function() {
      server.close();
    });
});
gulp.task('production-server', function() {
  setupServer('production');
});


// Open development page in browser
gulp.task('open', function() {
  open('http://localhost:3001');
});
