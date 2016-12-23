var gulp = require('gulp'),
  path = require('path'),
  gutil = require('gulp-util'),
  gfile = require('gulp-file'),
  gwatch = require('gulp-watch'),
  sourcemaps = require('gulp-sourcemaps'),
  gzip = require('gulp-gzip'),
  grollup = require('./plugins/gulp-rollup'),
  through2 = require('through2');

var rbabel = require('rollup-plugin-babel'),
  rlocalResolve = require('rollup-plugin-local-resolve'),
  ralias = require('rollup-plugin-alias'),
  rpostcss = require('rollup-plugin-postcss'),
  ruglify = require('rollup-plugin-uglify');

// PostCSS plugins
var simplevars = require('postcss-simple-vars'),
  nested = require('postcss-nested'),
  cssnext = require('postcss-cssnext'),
  cssnano = require('cssnano'),
  mixins = require('postcss-sassy-mixins')

function rollupConfig(mini) {
  return {
    entry: [{
      entry: './src/index.js',
      dest: 'argilo' + (mini ? '.min.js' : '.js')
    }, {
      entry: './src/doc/index.js',
      dest: 'argilo.doc' + (mini ? '.min.js' : '.js'),
      module: 'argiloDoc',
      plugins: ['resolve', 'css', 'babel', mini && 'uglify'],
      globals: {
        'argilo': 'argilo'
      },
      external: 'argilo'
    }],
    module: 'argilo',
    exports: 'default',
    format: 'umd',
    useStrict: false,
    plugins: ['resolve', 'alias', 'babel', mini && 'uglify'],
    pluginMap: {
      alias: ralias({
        'ilos': path.resolve('src/ilos/index.js'),
        'observi': path.resolve('src/observi/index.js')
      }),
      resolve: rlocalResolve(),
      babel: rbabel({
        runtimeHelpers: false,
        presets: ["es2015-loose-rollup"],
        plugins: [
          "transform-es3-member-expression-literals",
          "transform-es3-property-literals"
        ]
      }),
      uglify: ruglify(),
      css: rpostcss({
        extensions: ['.css'],
        plugins: [
          simplevars(),
          nested(),
          cssnext({
            warnForDuplicates: false,
          }),
          cssnano(),
          mixins()
        ]
      })
    }
  }
}

gulp.task('compile-all', ['generate-doc'], function() {
  return gulp.run(['compile', 'compile-zip'])
})

gulp.task('compile', function() {
  return gulp.src(['./src/**/*.js', './src/**/*.css'])
    .pipe(sourcemaps.init())
    .pipe(grollup(rollupConfig(false)))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'))
})

gulp.task('compile-zip', function() {
  return gulp.src(['./src/**/*.js', './src/**/*.css'])
    .pipe(sourcemaps.init())
    .pipe(grollup(rollupConfig(true)))
    .pipe(gzip())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'))
})

var docFiles = ['src/**/*.doc.js']
gulp.task('generate-doc', function() {
  gulp.src(docFiles).pipe(through2.obj(function(file, enc, cb) {
    docGenerator.applyFile(file.path, file.contents.toString(), false, cb)
  }, function(cb) {
    docGenerator.generate()
  }))
})
gulp.task('watch-doc', ['generate-doc'], function() {
  return gwatch(docFiles, function(file) {
    if (file.contents) { // add or change
      docGenerator.applyFile(file.path, file.contents.toString(), true)
    } else { //delete
      docGenerator.removeFile(file.path, true)
    }
  })
})

var docGenerator = (function() {
  var timeout = null,
    docs = {}

  function parsePath(str) {
    return path.relative(__dirname, str).replace(/\\/g, '/')
  }

  return {
    generate: function(cb) {
      var start = new Date()
      if (timeout)
        clearTimeout(timeout)
      timeout = setTimeout(function() {
        var paths = Object.keys(docs)
        var contents = [paths.map(function(path, i) {
          return 'import doc' + i + ' from "../../' + path + '"'
        }).join('\n'), 'export default {\n' + paths.map(function(path, i) {
          return '\tdoc' + i
        }).join(',\n') + '\n}']

        gfile('docs.js', contents.join('\n\n'))
          .pipe(gulp.dest('src/doc/'))
        gutil.log('Generate documents use ', gutil.colors.magenta((new Date() - start) + ' ms'))
        if (cb) cb()
        timeout = null
      }, 50)
    },
    applyFile: function(path, content, build, cb) {
      path = parsePath(path)
      docs[path] = {
        path: path,
        content: content
      }
      gutil.log('Apply document file ', gutil.colors.magenta(path))
      if (build) {
        this.generate(cb)
      } else if (cb) {
        cb()
      }
    },
    removeFile: function(path, build, cb) {
      path = parsePath(path)
      delete docs[path]
      gutil.log('Remove document file ', gutil.colors.magenta(path))
      if (build) {
        this.generate(cb)
      } else if (cb) {
        cb()
      }
    }
  }
})()
