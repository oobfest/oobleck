let gulp = require('gulp')
let pug = require('gulp-pug')

gulp.task('pug', ()=> {
	return gulp.src("views/*.pug")
		.pipe(pug())
		.pipe(gulp.dest("public"))
})