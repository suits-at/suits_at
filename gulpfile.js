var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    jsonminify = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    autoprefixer = require('gulp-autoprefixer'),
    nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

//env = 'production';
env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

jsSources = [
    'components/scripts/unused_template.js',
    'components/scripts/typed.js',
    'components/scripts/call_typed.js',
    'components/scripts/modernizr-custom.js',
    'components/scripts/menu.js',
    'components/scripts/svgxuse.js',
    'components/scripts/fullPageScrolling.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = ['components/json/*.json'];
imgSources = ['builds/development/images/**/*.*'];
nunjucksSources = ['components/pages/*.+(html|nunj)'];

//coffeeSources = ['components/coffee/tagline.coffee'];
//gulp.task('coffee', function () {
//    return gulp.src(coffeeSources)
//        .pipe(coffee({bare: true})
//            .on('error', gutil.log))
//        .pipe(gulp.dest('components/scripts'))
//});

gulp.task('js', function () {
    return gulp.src(jsSources)
        //.pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

//sourcemap = (environment == :production) ? false : true
//todo: testen ob autoprefixer funktioniert

gulp.task('compass', function () {
    return gulp.src(sassSources)
        .pipe(compass({
            //sourcemap: true,
            //debug: true,
            css: outputDir + 'css',
            sass: 'components/sass',
            //image: outputDir + 'images',
            style: sassStyle,
            project: __dirname,
            import_path: 'node_modules/foundation-sites/scss'
        }).on('error', gutil.log))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
        }).on('error', gutil.log))
        .pipe(gulp.dest( outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task('watch', function () {
    //gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    //gulp.watch('builds/development/*.html', ['html']);
    gulp.watch(['components/pages/*.+(html|nunj)', 'components/templates/**/*.+(html|nunj)'], ['nunjucks']);
    gulp.watch(jsonSources, ['json']);
    gulp.watch(imgSources, ['images']);
});

gulp.task('connect', function () {
    connect.server({
        root: outputDir,
        livereload: true
    });
});

//gulp.task('html', function () {
//    return gulp.src('builds/development/*.html')
//        .pipe(gulpif(env === 'production', htmlmin({collapseWhitespace: true})))
//        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
//        .pipe(connect.reload())
//});

gulp.task('nunjucks', function() {
    return gulp.src(nunjucksSources)
        .pipe(data(function() {
            return require('./components/json/data.json')
        }))
        .pipe(nunjucksRender({
            path: ['components/templates/']
        }).on('error', gutil.log))
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload())
});

gulp.task('images', function () {
    return gulp.src(imgSources)
        .pipe(gulpif(env === 'production', imagemin({
            progressive: true,
            svgoPlugin: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
        .pipe(connect.reload())
});

gulp.task('json', function () {
    return gulp.src(jsonSources)
        .pipe(gulpif(env === 'production', jsonminify()))
        .pipe(gulp.dest(outputDir + 'json'))
        .pipe(connect.reload())
});


gulp.task('default', ['nunjucks', 'json', 'js', 'compass', 'images', 'connect', 'watch']);