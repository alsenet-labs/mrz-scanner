/*
* Copyright (c) 2018 ALSENET SA
*
* Author(s):
*
*      Luc Deschenaux <luc.deschenaux@freesurf.ch>
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
*/

var path = require('path');
var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var sourcemaps = require('gulp-sourcemaps');
var debug=require('gulp-debug');
var log = require('gulplog');
var extend = require('extend');
var browserSync = require('browser-sync');
var es = require('event-stream');
var htmlreplace = require('gulp-html-replace');
var insert = require('gulp-insert');

var baseDir='build';
var dist=false;

if (process.env.ENV=='dist') {
  distEnv();
}

function distEnv() {
  dist=true;
  baseDir='dist';
}

function copy(){
  var arglist=Array.prototype.slice.call(arguments);
  var tasks=[];
  arglist.forEach(function(cp){
    tasks.push(
      gulp.src(cp.src)
      .pipe(debug({title: ' writing', showCount: false}))
      .pipe(gulp.dest(cp.dest))
      .on('error', function(e){
        throw e;
      })
    );
  });
  return es.merge(tasks)
  .on('error',function(e){
    throw e;
  });
}

gulp.task('dist-env', function(callback){
  distEnv();
  callback();
});

gulp.task('static-fs', function(callback) {
  var exec = require('child_process').exec;
  var job=exec('node ./static-fs-make.js', function(err, stdout, stderr){
    callback(err);
  });
});

gulp.task('scripts', ['static-fs'], function(){
  return processScripts({
    watchify: false,
    minify: dist,
    dest: baseDir+'/js'
  })
});

gulp.task('copy',function(){
  return copy({
    src: './src/index.html',
    dest: './'+baseDir+'/'
  });
});

gulp.task('wrap', ['scripts'], function(){
  var inFile=path.join(baseDir,'js/mrz-worker.bundle'+(dist?'-min':'')+'.js');
  return gulp.src(inFile)
  .pipe(insert.wrap('function mrz_worker(){\n','\n}'))
  .pipe(rename({
    dirname: '',
    extname: '-wrapped.js'
  }))
  .pipe(debug({title: ' writing', showCount: false}))
  .pipe(gulp.dest(baseDir+'/js'))
  .on('error',function(err){
    log.info(err);
  });
});

gulp.task('htmlreplace', ['copy'], function(){
  return gulp.src(baseDir+'/index.html')
    .pipe(htmlreplace({
      js: {
        src: null,
        tpl: [
          '<script src="js/mrz-worker.bundle'+(dist?'-min':'')+'-wrapped.js"></script>',
          '<script src="js/demo.bundle'+(dist?'-min':'')+'.js"></script>'
        ].join('\n')
      }
    }))
    .pipe(gulp.dest('./'+baseDir+'/'));
})

gulp.task('build', [
  'scripts',
  'wrap',
  'copy',
  'htmlreplace'
]);

gulp.task('dist',['dist-env'], function(){
  return gulp.start('build');
});

gulp.task('watch',function(){
  gulp.watch('./src/index.html',['htmlreplace'])
  return processScripts({
    justWatch: true,
    minify: dist,
    dest: './'+baseDir+'/js'
  });

});

gulp.task('serve',function(){
  browserSync.init([baseDir+'/**'], {
    watchOptions: {
      ignoreInitial: true
    },
    server: {
      baseDir: baseDir
    },
    https: false
  });
});

gulp.task('default', ['build', 'watch'], function(){
  return gulp.start('serve');
});

function processScripts(options){
  options=options||{};

  var files=[
    'src/demo.js',
    'src/mrz-worker.js'
  ];

  var _watchify_enabled=(options.watchify===true || options.justWatch==true);
  var _watchify=(_watchify_enabled)?watchify:function(b){return b};

  var tasks=files.map(function(filename){
    var b=_watchify(browserify(extend(true,{},
      watchify.args,
      {
        debug: true
      }
    )))
    .add(filename)
    .on('update', bundle)
    .on('log', log.info)

    function bundle() {
      var stream=b.transform('babelify', {
        presets: [["env",{
          "targets": {
            "browsers": ["last 2 versions", "safari >=7"]
          }
        }]],
        sourceMaps: true,
        plugins: [
          ["transform-runtime", {
            "helpers": false,
            "polyfill": false,
            "regenerator": true,
            "moduleName": "babel-runtime"
          }]
        ]
      })
      .bundle()
      .on('error', function(err){
        console.error(err);
        this.emit('end');
      })
      .on('log',log.info)
      .pipe(source(filename))
      .pipe(buffer())
      .pipe(rename({
        dirname: '',
        extname: '.bundle.js'
      }))
      .pipe(sourcemaps.init({loadMaps: true}))

      if (options.minify) {
        stream=stream.pipe(minify())
        .on('error',function(err){
          console.error(err);
        })
      }

      return stream.pipe(sourcemaps.write('./'))
      .pipe(debug({title: ' writing', showCount: false}))
      .pipe(gulp.dest(options.dest))
    }

    return options.justWatch?b.bundle():bundle();

  });
  return es.merge.apply(null,tasks);
}
