var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
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
    critical = require('critical'),
    fs = require('fs'),
    concat = require('gulp-concat');

var env,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = 'production';
// env = 'development';

if (env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

//'components/scripts/fullPageScrolling.js',
jsSourcesIndex = [
    'components/scripts/modernizr-custom.js',
    'components/scripts/jquery.js',
    'components/scripts/velocity.js',
    'components/scripts/typed.js',
    'components/scripts/menu.js',
    'components/scripts/portfolio.js',
    'components/scripts/callsOnIndex.js',
    'components/scripts/google.js',
    'components/scripts/svgxuse.js'
];

jsSources = [
    'components/scripts/modernizr-custom.js',
    'components/scripts/jquery.js',
    'components/scripts/velocity.js',
    'components/scripts/menu.js',
    'components/scripts/google.js',
    'components/scripts/svgxuse.js',
    'components/scripts/fontawesome.js',
    'components/scripts/fa-regular.js'
];

sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = ['components/json/*.json'];
imgSources = ['components/img/**/*.+(png|jpg|jpeg)'];
svgSources = ['components/img/**/*.+(svg)'];
nunjucksSources = ['components/pages/*.+(html|nunj)'];

gulp.task('connect', function () {
    connect.server({
        root: outputDir,
        livereload: true
    });
});

gulp.task('js', function () {
    return gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('jsIndex', function () {
    return gulp.src(jsSourcesIndex)
        .pipe(concat('index.js'))
        .pipe(browserify())
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('sass', function () {
    return gulp.src(sassSources)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['node_modules/foundation-sites/scss', 'node_modules/typi/scss']
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
        }).on('error', gutil.log))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task('watch', function () {
    gulp.watch(jsSources, ['js']);
    gulp.watch(jsSourcesIndex, ['jsIndex']);
    gulp.watch('components/sass/*.scss', ['sass']);
    gulp.watch(imgSources, ['images']);
    gulp.watch(jsonSources, ['json', 'html']);
    gulp.watch(['components/pages/*.+(html|nunj)', 'components/templates/**/*.+(html|nunj)'], ['critical']);
});

//call html after nunjucks finished
gulp.task('html', ['nunjucks'], function () {
    return gulp.src(outputDir + '*.html')
        .pipe(gulpif(env === 'production', htmlmin(
            {
                collapseWhitespace: true,
                minifyJS: true,
                minifyCSS: true
            }
        )))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});

gulp.task('nunjucks', function () {
    return gulp.src(nunjucksSources)
        .pipe(data(function () {
            return JSON.parse(fs.readFileSync('./components/json/data.json', 'utf8'));
        }))
        .pipe(nunjucksRender({
            path: ['components/templates/']
        }).on('error', gutil.log))
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload())
});

gulp.task('images', function () {
    return gulp.src(imgSources)
        .pipe(gulpif(env === 'production', imagemin()))
        .pipe(gulp.dest(outputDir + 'images'))
        .pipe(connect.reload())
});

// copy svg files to build
gulp.task('svg', function () {
    return gulp.src(svgSources)
        .pipe(gulp.dest(outputDir + 'images'))
        .pipe(connect.reload())
});


gulp.task('json', function () {
    return gulp.src(jsonSources)
        .pipe(gulpif(env === 'production', jsonminify()))
        .pipe(gulp.dest(outputDir + 'json'))
        .pipe(connect.reload())
});

// generate critical css and inline it
gulp.task('critical', ['html'], function () {
    critical.generate(
        {
            inline: true,
            base: outputDir,
            src: 'index.html',
            dest: outputDir + 'index.html',
            minify: true,
            width: 1300,
            height: 900
        }
    )
});

gulp.task('default', ['json', 'js', 'jsIndex', 'sass', 'images', 'svg', 'nunjucks', 'html', 'critical', 'connect', 'watch']);
