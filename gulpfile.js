var path = require('path'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  gfile = require('gulp-file'),
  gwatch = require('gulp-watch'),
  connect = require('gulp-connect'),
  through2 = require('through2'),
  grollup = require('./plugins/gulp-rollup'),
  generator = require('./plugins/gulp-code-generator')

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
      sourceRoot: '/argilo/doc',
      external: 'argilo',
      banner: banner()
    }, {
      entry: './src/perf/index.js',
      dest: 'argilo.perf' + (mini ? '.min.js' : '.js'),
      module: 'argiloPerf',
      globals: {
        'argilo': 'argilo'
      },
      sourceRoot: '/argilo/perf',
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

function documentScript(watch) {
  return generator({
    src: 'src/**/*.doc.js',
    template: `<% var i=0; each(function(file){%>export {default as doc<%=i++%>} from '<%=path.relative(output, file.path).replace(/\\\\/g, '/')%>'\n<%})%>`,
    output: 'document.js',
    watch: watch,
    dest: 'src/doc/'
  })
}

function perfScript(watch) {
  return generator({
    src: 'src/**/*.perf.js',
    template: `<% var i=0; each(function(file){%>
import * as doc<%=i++%> from '<%=path.relative(output, file.path).replace(/\\\\/g, '/')%>'
<%})%>

export {
  <%= Object.keys(files).map((k, i)=>'doc'+i).join('\\n\\t') %>
}`,
    output: 'perf.js',
    watch: watch,
    dest: 'src/perf'
  })
}

var documentScriptTask = streamTask('generate-document', documentScript)
var perfScriptTask = streamTask('generate-perf', perfScript)

gulp.task('package', ['generate-document', 'generate-perf'], function() {
  return Promise.all([compile(), zip()])
})
gulp.task('build', ['package'])

var watchSource = streamTask('watch-source', function() {
  return gulp.src(['./src/**/*.js', './src/**/*.css'])
    .pipe(grollup(rollupConfig(false, function(stream) {
      return stream.pipe(gulp.dest('./dist')).pipe(connect.reload())
    })))
    .pipe(gulp.dest('./dist'))
})
gulp.task('watch-document', documentScript.bind(null, true))
gulp.task('watch-perf', perfScript.bind(null, true))
gulp.task('watch', ['watch-document', 'watch-perf'], function() {
  return watchSource()
})

gulp.task('server', ['watch'], function() {
  connect.server({
    name: 'Argilo',
    root: ['.'],
    port: 8000,
    livereload: false
  })
})
