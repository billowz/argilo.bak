var express = require('express'),
  fs = require('fs'),
  path = require('path'),
  compile = require('./compile'),
  root = path.join(__dirname, '../')


function devServer(base, port, options) {
  var app = express(),
    fileMap = {}

  function addContent(map, path, content) {
    if (path) {
      map[path[0] === '/' ? path : '/' + path] = content
      console.log('apply file:' + path + ' (' + size(content) + ')')
    }
  }

  function filepath(path) {
    return path.replace(root, '').replace(/\\/g, '/')
  }

  function rollup(options, done) {
    var watchs = {},
      isBuilding = false

    function build(processor) {
      if (isBuilding)
        return;

      isBuilding = true
      processor.apply(null, [(err) => {
        isBuilding = false
      }].concat(Array.prototype.slice.call(arguments, 1)))
    }

    function c(done) {
      var start = new Date()
      console.log(`rollup[${options.rollup.entry}]: compiling...`)
      compile.compile(options).then(rs => {
        var bundle = rs.bundle,
          main = rs.main,
          mini = rs.mini,
          gzip = rs.gzip,
          map = {},
          _watchs = {}

        options.rollup.cache = bundle

        bundle.modules.forEach(m => {
          var file = m.id

          if (path.isAbsolute(file)) {
            var w = watchs[file]
            if (!w) {
              console.log(`rollup[${options.rollup.entry}]: watch ${filepath(file)}`)
              w = fs.watch(file, (function(file) {
                return function(type) {
                  console.log(`rollup[${options.rollup.entry}]: file[${filepath(file)}] ${type}`)
                  build(c)
                }
              })(file))
            }
            _watchs[file] = w
          }
        })
        for (var _path in watchs) {
          if (!_watchs[_path]) {
            console.log(`rollup[${options.rollup.entry}]: unwatch ${filepath(_path)}`)
            watchs[_path].close()
          }
        }
        watchs = _watchs

        addContent(map, main.dest, main.code)
        if (main.sourcemap)
          addContent(map, main.sourcemapDest, JSON.stringify(main.sourcemap))
        if (mini) {
          addContent(map, mini.dest, mini.code)
          if (mini.sourcemap)
            addContent(map, mini.sourcemapDest, JSON.stringify(mini.sourcemap))
          if (gzip)
            addContent(map, gzip.dest, gzip.code)
        }
        Object.assign(fileMap, map)
        console.log(`rollup[${options.rollup.entry}]: compile use ${new Date() - start} ms`)
        done()
      }).catch(e => {
        console.log(`rollup[${options.rollup.entry}]: compile failed: ${e}`)
        done(e)
      })
    }
    c(done || function() {})
  }
  options.forEach(opt => rollup(opt))

  app.use(function(req, res, next) {
    var content = fileMap[req.path]
    if (content) {
      res.send(content)
    } else {
      next()
    }
  })
  if (base)
    app.use(express.static(base))
  app.listen(port)
  console.log('listen localhost:' + port)
  return app
}

function size(buf) {
  return (buf.length / 1024).toFixed(2) + 'kb'
}

devServer(root, 3000, [require('./rollup.config'), require('./doc.rollup.config')])
