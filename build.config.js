/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {

    //dist path is relative to gulpfile.js root dir
    dist: './dist',
    assets: "./dist/assets",
    css: './dist/css',
    js: './dist/js',
    img: "./dist/img",
    fonts: "./dist/assets/fonts",
    gif: "./dist/css",



    app_files: {
        js: [
            './src/**/*.js',
            '!./src/**/*.test.js'
        ],
        less: ['./src/less/app.less'],
        partials: './src/app/**/*.tpl.html',
        index: './src/index.html',
        assets: ['!./src/assets/img/', '!./src/assets/img/*',  './src/assets/**/*'],
        img: './src/assets/img/**/*'
    },


    vendor: {
        js: [
            './vendor/jquery/dist/jquery.min.js',
            './vendor/angular/angular.js',
            // './vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
            // './vendor/angular-bootstrap/ui-bootstrap.min.js',
            // './vendor/bootstrap/dist/js/bootstrap.min.js',
            './vendor/angular-translate/angular-translate.min.js',
            './vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
            './vendor/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
            './vendor/angular-translate-storage-local/angular-translate-storage-local.min.js',


        ],
        css: [

        ],
        // fonts: ['./vendor/bootstrap/fonts/*'],
        gif: [
            
        ]
    }
};
