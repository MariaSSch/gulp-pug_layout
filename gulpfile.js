const gulp 			= require('gulp');
const sass 			= require('gulp-sass')(require('sass'));
const browserSync 	= require('browser-sync').create();
const imagemin 		= require('gulp-imagemin');
const pngquant 		= require('imagemin-pngquant');
const uglify		= require('gulp-uglifyjs');
const cache 		= require('gulp-cache');
const clean 		= require('gulp-clean');
const autoprefixer	= require('gulp-autoprefixer');
const pug 			= require('gulp-pug');


//sass+
gulp.task('sass', ()=>{ // Создаем таск "sass"
	return gulp.src(['app/sass/**/*.sass', '!app/sass/styles/**/*.sass']) // Берем источник !=> если будет несколько результирующих sass-файлов, нодо изменить на 'app/sass/**/*.sass'
				.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
				.pipe(autoprefixer({cascade: true}))
				.pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
				.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

//js+
gulp.task('script', ()=>{
	return gulp.src('app/js/**/*.js')
				.pipe(gulp.dest('dist/js'))
})

//img+
gulp.task('img', ()=>{
	return gulp.src('app/img/**/*')
				.pipe(cache(imagemin({
					interlaced: true,
					progressive: true,
					svgoPlugins: [{removeViewBox: false}],
					use: [pngquant()]
				})))
				.pipe(gulp.dest('dist/img'))
});

//pug
gulp.task('pug-compile', ()=>{
	return gulp.src(['app/pug/**/*.pug', '!app/pug/includes/**/*.pug'])
	  .pipe(pug({pretty:true}))
	  .pipe(gulp.dest('app/html'))
  });

//html+
gulp.task('code', ()=>{
	return gulp.src('app/html/*.html')
				.pipe(browserSync.reload({stream: true}))
});


//browsers+
gulp.task('browser-sync', ()=> {
	browserSync.init({ //fixed + .init
		server: {
			baseDir: 'app/html/'
		},
		notify: false
	});
});

//clean cache
gulp.task('clear', ()=>{
	return cache.clearAll();
});

//clean /dist
gulp.task('clean', ()=>{
	return gulp.src('dist', {allowEmpty: true})
				.pipe(clean());
});

//prebuild+
gulp.task('prebuild', async ()=>{
	let buildCSS 	= gulp.src('app/sass/main.sass').pipe(gulp.dest('dist/css'));
	let buildFonts 	= gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));
	let buildJS 	= gulp.src('app/js/**/*').pipe(uglify()).pipe(gulp.dest('dist/js'));
	let buildHTML 	= gulp.src('app/*.html').pipe(gulp.dest('dist'));
});

//watch+
gulp.task('watch',()=>{
	gulp.watch('app/sass/main.sass', gulp.parallel('sass'));
	gulp.watch('app/pug/**/*.pug', gulp.parallel('pug-compile'));
	gulp.watch('app/*.html', gulp.parallel('code'));
	gulp.watch('app/js/**/*.js', gulp.parallel('script'));
  });

//default+
gulp.task('default', gulp.parallel('sass', 'script', 'browser-sync', 'watch')); //code нет в примере

//build+
gulp.task('build', gulp.series('clean', 'prebuild', 'img', 'sass', 'script'));//para que sass & scripts

