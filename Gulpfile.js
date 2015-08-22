var gulp = require('gulp'),
  connect = require('gulp-connect');
 
gulp.task('connect', function() {
  connect.server({
  	port: 5000
  });
});
 
gulp.task('default', ['connect']);