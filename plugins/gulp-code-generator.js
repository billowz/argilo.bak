var path = require('path'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  gwatch = require('gulp-watch'),
  bufferFrom = require('buffer-from'),
  through2 = require('through2'),
  ejs = require('ejs')


module.exports = function(options) {
  var src = options.src,
    template = options.template,
    variables = options.variables || {},
    output = options.output,
    watch = options.watch,
    events = options.events || ['add', 'change', 'unlink'],
    dest = options.dest,
    name = options.name || output || src

  function parsePath(p) {
    return p
  }

  var files = {}

  variables = Object.assign({
    files: files,
    each: function(cb) {
      for (var key in files) {
        cb(files[key], key)
      }
    },
    output: path.relative(process.cwd(), dest),
    path: path,
    util: gutil
  }, variables)

  function add(path, content) {
    path = parsePath(path)
    files[path] = {
      path: path,
      content: content
    }
  }

  function remove(path) {
    path = parsePath(path)
    delete files[path]
  }

  function generate(stream) {
    return new Promise(function(rev, rej) {
      if (typeof template == 'function') {
        template(stream, files, rev)
      } else {
        stream.push(createFile(output, ejs.render(template, variables)))
        rev()
      }
    })
  }


  var start = new Date()
  gutil.log(`Loading ${gutil.colors.magenta(src)} `)
  var stream = gulp.src(src)
    .pipe(through2.obj(function(file, enc, cb) {
      add(file.path, file.contents.toString())
      cb()
    }, function(cb) {
      gutil.log(`Loading ${gutil.colors.magenta(src)} use ${gutil.colors.magenta(new Date() - start)} ms\n\t${Object.keys(files).join('\n\t')}`)
      gutil.log(`Generating ${gutil.colors.magenta(name)}`)
      start = new Date()
      var self = this
      generate(this).then(function() {
        gutil.log(`Generate ${gutil.colors.magenta(name)} use ${gutil.colors.magenta(new Date() - start)} ms`)
        cb()
        self.emit('end')
      }).catch(function(err) {
        gutil.log(`Generate ${gutil.colors.magenta(name)} failed:\n`, err)
        self.emit('error', err)
        throw err
      })
    }))
    .pipe(gulp.dest(dest))

  if (watch) {
    gutil.log(`Watching ${gutil.colors.magenta(src)} `)
    gwatch(src, events, function(file) {
      gutil.log(`File ${file.event} ${gutil.colors.magenta(file.path)}`)
      if (file.event == 'unlink') {
        remove(file.path)
      } else {
        var content = file.contents.toString()
        if (files[path] && content === files[path].content)
          return
        add(file.path, content)
      }
      regenerate()
    })

    var generating = false,
      needRegenerate = false

    function regenerate() {
      if (generating) {
        needRegenerate = true
        return
      }
      gutil.log(`Re-Generating ${name} `)
      var start = new Date()
      var stream = through2.obj(function(file, err, cb) {
        this.push(file)
        cb()
      })
      generate({
        push(file) {
          stream.write(file)
        }
      }).then(function() {
        stream.pipe(gulp.dest(dest))
        gutil.log(`Re-Generate ${gutil.colors.magenta(name)} use ${gutil.colors.magenta(new Date()-start)} ms`)
        stream.end()
        stream.destroy()
        generating = false
        if (needRegenerate) {
          needRegenerate = false
          regenerate()
        }
      }).catch(function(err) {
        gutil.log(`Re-Generate ${gutil.colors.magenta(name)} failed:\n`, err)
        stream.end()
        stream.destroy()
        generating = false
        if (needRegenerate) {
          needRegenerate = false
          regenerate()
        }
      })
    }
  }
  return stream
}


function createFile(path, content) {
  var file = new gutil.File({
    path: path,
    contents: bufferFrom(content)
  })
  gutil.log(`Generate file ${gutil.colors.magenta(path)} (${size(content)})`)
  return file
}

function size(buf) {
  return gutil.colors.magenta((buf.length / 1024).toFixed(2) + 'kb')
}
