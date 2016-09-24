var gulp = require('gulp');

// for javascript
var browserify = require('browserify');
var yamlify = require('yamlify');
var source = require('vinyl-source-stream');

// for css
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

// for server
var browserSync = require('browser-sync');
var reload = browserSync.reload;


gulp.task('js', () => {
  return browserify({entries: ['./js/main.js']})
  .transform(yamlify)
  .bundle()
  .on('error', onError)
  .pipe(source('./main.js'))
  .pipe(gulp.dest('.'))
  .pipe(reload({stream: true}));
});


gulp.task('less', () => {
  return gulp.src('./css/main.less')
    .pipe(less({paths: [ './css' ]}))
    .on('error', onError)
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
    .pipe(gulp.dest('./'))
    .pipe(reload({stream: true}));
});

function onError(err) {
  console.log(err.message);
  this.emit('end');
}

gulp.task('serve', ['js', 'less'], () => {
  browserSync({server: {baseDir: '.'}});

  gulp.watch('./index.html').on('change', () =>{
    console.log('wtf');
    reload()
  });
  gulp.watch('./css/**/*.less', ['less']);
  gulp.watch(['./js/**/*.js','./data.yaml'], ['js']);
});


