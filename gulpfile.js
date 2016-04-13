var gulp = require('gulp'),
    gutil = require('gulp-util'),
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

// env = 'production';
env = process.env.NODE_ENV || 'development';

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
    'components/scripts/svgxuse.js'
];

sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = ['components/json/*.json'];
imgSources = ['builds/development/images/**/*.+(png|jpg|jpeg)'];
nunjucksSources = ['components/pages/*.+(html|nunj)'];

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

//sourcemap = (environment == :production) ? false : true

gulp.task('compass', function () {
    return gulp.src(sassSources)
        .pipe(compass({
            //sourcemap: true,
            css: outputDir + 'css',
            sass: 'components/sass',
            style: sassStyle,
            project: __dirname,
            import_path: ['node_modules/foundation-sites/scss', 'node_modules/typi/scss']
        }).on('error', gutil.log))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
        }).on('error', gutil.log))
        .pipe(gulp.dest( outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task('watch', function () {
    gulp.watch(jsSources, ['js']);
    gulp.watch(jsSourcesIndex, ['jsIndex']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch(imgSources, ['images']);
    gulp.watch(jsonSources, ['json', 'html']);
    gulp.watch(['components/pages/*.+(html|nunj)', 'components/templates/**/*.+(html|nunj)'], ['critical']);
});

gulp.task('connect', function () {
    connect.server({
        root: outputDir,
        livereload: true
    });
});

//call html after nunjucks finished
gulp.task('html', ['nunjucks'], function () {
    return gulp.src(outputDir +'*.html')
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

gulp.task('nunjucks', function() {
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
        .pipe(gulpif(env === 'production', imagemin({
            progressive: true,
            svgoPlugin: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ],
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

gulp.task('critical', ['html'], function () {
    critical.generate({
        inline: true,
        base: 'builds/production/',
        src: 'index.html',
        dest: 'builds/production/index.html',
        minify: true,
        width: 320,
        height: 480
    });
});

gulp.task('default', ['json', 'js', 'jsIndex', 'compass', 'images', 'nunjucks', 'html', 'critical', 'connect', 'watch']);