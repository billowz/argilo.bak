var gulp = require('gulp'),
  path = require('path'),
  gutil = require('gulp-util'),
  gfile = require('gulp-file'),
  gwatch = require('gulp-watch'),
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

var pkg = require('./package.json')

function banner() {
  return `/*
 * ${pkg.name} v${pkg.version} built in ${new Date().toUTCString()}
 * Copyright (c) 2016 ${pkg.author}
 * Released under the ${pkg.license} license
 * support IE6+ and other browsers
 * ${pkg.homepage}
 */`
}

var docFiles = ['src/**/*.doc.js']

function rollupConfig(mini) {
  return {
    entry: [
      /*{
            entry: './src/index.js',
            dest: 'argilo' + (mini ? '.min.js' : '.js'),
            banner: banner()
          }, */
      {
        entry: './src/doc/index.js',
        dest: 'argilo.doc' + (mini ? '.min.js' : '.js'),
        module: 'argiloDoc',
        plugins: ['resolve', 'css', 'babel', mini && 'uglify'],
        globals: {
          'argilo': 'argilo'
        },
        sourceRoot: 'argiloDoc',
        external: 'argilo',
        banner: banner()
      }
    ],
    module: 'argilo',
    exports: 'default',
    format: 'umd',
    useStrict: false,
    sourceMap: true,
    gzip: mini,
    watch: function(stream) {
      stream.pipe(gulp.dest('./test'))
    },
    sourceRoot: 'argilo',
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

function usetime(use) {
  if (use > 1000) {
    use = (use / 1000).toFixed(2) + ' s'
  } else {
    use = use + ' ms'
  }
  return gutil.colors.magenta(use)
}

function streamTask(name, cb) {
  var colorName = gutil.colors.cyan(name)

  function task() {
    var start = new Date()
    gutil.log(`Executing Task '${colorName}'...`)
    return new Promise(function(resolve, reject) {
      var stream = cb()
      stream.on('end', function() {
        gutil.log(`Execute Task '${colorName}' use ${usetime(new Date() - start)}`)
        resolve()
      })
      stream.on('error', function(err) {
        gutil.log(gutil.colors.red(`Execute Task '${colorName}' failed:`), err)
        reject(err)
      })
    })
  }
  gulp.task(name, task)
  return task
}

var compile = streamTask('compile', function() {
  return gulp.src(['./src/**/*.js'])
    .pipe(grollup(rollupConfig(false)))
    .pipe(gulp.dest('./dist'))
})
var zip = streamTask('compile-zip', function() {
  return gulp.src(['./src/**/*.js', './src/**/*.css'])
    .pipe(grollup(rollupConfig(true)))
    .pipe(gulp.dest('./dist'))
})

var generateDoc = streamTask('generate-doc', function() {
  return gulp.src(docFiles)
    .pipe(through2.obj(function(file, enc, cb) {
      docGenerator.applyFile(file.path, file.contents.toString(), false, cb)
    }, function(flush) {
      var self = this
      docGenerator.generate(function() {
        flush()
        self.emit('end')
      })
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

gulp.task('compile-all', function() {
  return generateDoc().then(function() {
    return Promise.all([compile(), zip()])
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
        gutil.log('Generate documents use ' + usetime(new Date() - start))
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
