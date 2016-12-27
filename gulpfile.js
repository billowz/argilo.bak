var path = require('path'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  gfile = require('gulp-file'),
  gwatch = require('gulp-watch'),
  connect = require('gulp-connect'),
  through2 = require('through2'),
  grollup = require('./plugins/gulp-rollup')

var rollupPlugins = require('./rollup.plugins.config')

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

function rollupConfig(mini, watch) {
  return {
    entry: [{
      entry: './src/index.js',
      dest: 'argilo' + (mini ? '.min.js' : '.js'),
      banner: banner()
    }, {
      entry: './src/doc/index.js',
      dest: 'argilo.doc' + (mini ? '.min.js' : '.js'),
      module: 'argiloDoc',
      plugins: rollupPlugins.get(['resolve', 'css', 'babel', mini && 'uglify']),
      globals: {
        'argilo': 'argilo'
      },
      sourceRoot: '/argiloDoc',
      external: 'argilo',
      banner: banner()
    }],
    module: 'argilo',
    exports: 'default',
    format: 'umd',
    useStrict: false,
    sourceMap: true,
    sourceRoot: '/argilo',
    gzip: mini,
    watch: watch,
    watchSrc: ['src/**/*.js'],
    plugins: rollupPlugins.get(['resolve', 'alias', 'babel', mini && 'uglify'])
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
gulp.task('compile-all', function() {
  return generateDoc().then(function() {
    return Promise.all([compile(), zip()])
  })
})

gulp.task('build', ['compile-all'])

gulp.task('watch', ['watch-doc'], function() {
  return gulp.src(['./src/**/*.js', './src/**/*.css'])
    .pipe(grollup(rollupConfig(false, function(stream) {
      return stream.pipe(gulp.dest('./dist')).pipe(connect.reload())
    })))
    .pipe(gulp.dest('./dist'))
})

gulp.task('watch-doc', ['generate-doc'], function(done) {
  gwatch(docFiles, function(file) {
    if (file.event == 'unlink') {
      docGenerator.removeFile(file.path, true)
    } else if (file.event == 'add') {
      docGenerator.applyFile(file.path, file.contents.toString(), true)
    }
  })
  done()
})

gulp.task('server', ['watch'], function() {
  connect.server({
    name: 'Argilo',
    root: ['.'],
    port: 8000,
    livereload: true
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
