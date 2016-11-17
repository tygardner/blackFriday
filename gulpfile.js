//npm modules
var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    jshint = require("gulp-jshint"),
    del = require("del"),
    less = require("gulp-less"),
    minify = require('gulp-minify-css'),
    html2js = require("gulp-ng-html2js"),
    minifyHtml = require("gulp-htmlmin"),
    concat = require("gulp-concat"),
    ngAnnotate = require('gulp-ng-annotate'),
    
    inject = require('gulp-inject'),
    
    streamSeries = require('stream-series'),
    
    insertLines = require('gulp-insert-lines'),

    /* Note: 
        yargs and gulp-if allows us to do pass in flags and evaluate them when we run gulp. This helps us decide whether or not to 
        minify/uglify something or have an expanded file.
        Try gulp vs gulp --prod to see.
    */

    argv = require('yargs').argv,
    gulpif = require('gulp-if'),

    //other requires
    app = require("./build.config.js"),
    pkg = require("./package.json");


// function onError(err) {
//     console.log(err);
//     this.emit("end");
// }

gulp.task('default', function() {

    //Remove old dist dir
    //set force option so it can delete outside the parent dir
    del([app.dist], {
        "force": true
    }, function() {
        //lint,uglify and copy files to dist/js
        var appJs = gulp.src(app.app_files.js)
        .pipe(jshint({
                forin: true,
                browser: true,
                jquery: true
            }))
            .pipe(jshint.reporter('default'))
            .pipe(gulpif(argv.prod, ngAnnotate()))
            .pipe(gulpif(argv.prod, uglify()))
            .pipe(concat('app-' + pkg.version + '.js'))
            .pipe(gulp.dest(app.js));
        //compile less files
        var appCss = gulp.src(app.app_files.less)
            .pipe(less())
            .pipe(gulpif(argv.prod, minify()))
            .pipe(concat('app-' + pkg.version + '.css'))
            .pipe(gulp.dest(app.css));


        //copy js vendor js files
        var vendorJs = gulp.src(app.vendor.js)
            .pipe(gulpif(argv.prod, concat('vendor-' + pkg.version + '.js')))
            //.pipe(concat('vendor-' + pkg.version + '.js'))
            .pipe(gulpif(argv.prod, uglify({
                mangle: false
            })))
            .pipe(gulp.dest(app.js));

        //copy vendor css files
       var vendorCss = gulp.src(app.vendor.css)
            .pipe(concat('vendor-' + pkg.version + '.css'))
            .pipe(gulp.dest(app.css));
        //copy vendor gif files
        // gulp.src(app.vendor.gif)
        //     .pipe(gulp.dest(app.gif));

        //Copy assets   
        gulp.src(app.app_files.assets) //copies everything except images.
            .pipe(gulp.dest(app.assets));

        //Copy images   
        gulp.src(app.app_files.img)
            .pipe(gulp.dest(app.img));


        //compile partials
        var partialsJs = gulp.src(app.app_files.partials)
            .pipe(
                gulpif(argv.prod, minifyHtml({
                    collapseWhitespace: true,
                    keepClosingSlash: true,
                    caseSensitive: true,
                    conservativeCollapse: true
                }))

            )
            .pipe(html2js({
                moduleName: "templates-app",
                prefix: "partials/"
            }))
            .pipe(concat('partials-' + pkg.version + '.js'))
            .pipe(gulp.dest(app.js));



        gulp.src('./src/index.html')
            .pipe(inject(streamSeries(vendorJs, partialsJs, appJs), {
                ignorePath: "/dist",
                addPrefix: ".",
                addRootSlash: false
            }))
            .pipe(inject(streamSeries(vendorCss,appCss), {
                ignorePath: "/dist",
                addPrefix: ".",
                addRootSlash: false
            }))
            .pipe(insertLines({
                'after': /<head>$/,
                'lineAfter': '<script type="text/javascript"> var appVersion="' + pkg.version + '";</script>'
            }))
            .pipe(gulp.dest('./dist'));



    }); //end del callback

}); //end task

gulp.task('watch', ['default', 'initWatch']);
gulp.task('initWatch', function() {
    gulp.watch(["src/**/*"], ["default"]);
});

