/**
 * "buffer-from": "^0.1.0",
 * "gulp-util": "^3.0.6",
 * "readable-stream": "^2.1.4",
 * "rollup": "^0.36.0",
 *
 */
var PLUGIN_NAME = 'gulp-rollup',
  rollup = require('rollup'),
  util = require('util'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  gfile = require('gulp-file'),
  Transform = require('readable-stream').Transform,
  path = require('path'),
  bufferFrom = require('buffer-from'),
  virtualfile = require('./rollup-plugin-virtualfile'),
  zlib = require('zlib'),
  fs = require('fs'),
  gwatch = require('gulp-watch'),
  through2 = require('through2')

var PluginError = gutil.PluginError
var watchOpts = {
  encoding: 'utf-8',
  persistent: true
}

function build(stream, entry) {
  var opt = entry.option,
    dest = entry.dest,
    sourceRoot = entry.sourceRoot,
    sourceMap = entry.sourceMap,
    gzip = entry.gzip

  return new Promise(function(rev, rej) {
    rollup.rollup(opt).then(function(bundle) {
      var result = bundle.generate(opt),
        code = result.code,
        map = result.map
      if (map) {
        map.sourceRoot = sourceRoot
        if (!sourceMap) {
          map.file = dest
        } else if (sourceMap === 'inline') {
          code += '\n//# sourceMappingURL=' + map.toUrl()
        } else {
          var mapFile = typeof sourceMap === 'string' ? sourceMap : dest + '.map'
          code += '\n//# sourceMappingURL=' + mapFile.replace(/(.*\/)|(.*\\)/g, '')
          stream.push(createFile(mapFile, JSON.stringify(map)))
        }
      }
      var file = createFile(dest, code)
      file.sourceMap = map
      stream.push(file)
      if (gzip)
        stream.push(createFile(typeof gzip === 'string' ? gzip : dest + '.gz', zlib.gzipSync(code)))
      rev(bundle)
    }).catch(function(err) {
      rej(err)
    })
  })
}

function GulpRollup(options) {
  var self = this

  Transform.call(self, {
    objectMode: true
  })

  options = Object.assign({}, options)

  var pluginMap = delProp(options, 'pluginMap') || {},
    watch = delProp(options, 'watch'),
    watched = {},
    virtualfilePlugin,
    files = {},
    haveSourcemaps,
    entries = (function parseEntries() {
      var entries = options.entry
      if (typeof entries === 'string') {
        entries = [{
          entry: entries
        }]
      } else if (Array.isArray(entries)) {
        entries = entries.map(function(opt) {
          if (typeof opt === 'string') {
            return {
              entry: opt
            }
          } else if (opt && opt.entry) {
            return opt
          }
        }).filter(function(opt) {
          return opt
        })
      } else if (entries) {
        return Object.keys(entries).map(function(entry) {
          var opt = entries[entry]
          if (typeof opt === 'string') {
            opt = {
              dest: opt
            }
          } else if (opt) {
            opt.entry = entry
            return opt
          }
        }).filter(function(opt) {
          return opt
        })
      } else {
        entries = []
      }
      return entries
    })()


  self._transform = function(file, enc, cb) {
    if (!file.isBuffer()) {
      self.emit('error', new PluginError(PLUGIN_NAME, 'Input files must be buffered!'))
      return cb()
    }

    files[file.path] = file.contents.toString()

    if (haveSourcemaps === undefined) {
      haveSourcemaps = file.sourceMap !== undefined
    } else if (haveSourcemaps !== (file.sourceMap !== undefined)) {
      self.emit('error', new PluginError(PLUGIN_NAME, 'Mixing of sourcemapped and non-sourcemapped files!'))
      return cb()
    }
    cb()
  }



  self._flush = function(cb) {
    virtualfilePlugin = virtualfile({
      files: files
    })
    files = undefined
    entries = entries.map(function(opt, i) {
      var sourceMap = opt.sourceMap || options.sourceMap
      opt = Object.assign({}, options, opt, {
        sourceMap: sourceMap || haveSourcemaps,
        plugins: (('plugins' in opt ? opt.plugins : options.plugins) || [])
          .map(function(plugin) {
            if (!plugin) return null
            if (typeof plugin === 'string')
              return pluginMap[plugin]
            return plugin
          })
          .filter(function(plugin) {
            return plugin
          }).concat(virtualfilePlugin)
      })
      var m = delProp(opt, 'module')
      if (m)
        opt.moduleId = opt.moduleName = m
      return {
        id: i,
        dest: opt.dest || opt.entry,
        sourceMap: sourceMap,
        sourceRoot: delProp(opt, 'sourceRoot'),
        gzip: delProp(opt, 'gzip'),
        watch: delProp(opt, 'watch'),
        option: opt
      }
    })
    var watchFiles = watch && {}
    Promise.all(entries.map(function(entry) {
      if (watch) {
        return build(self, entry).then(function(bundle) {
          return new Promise(function(rev, rej) {
            bundle.modules.forEach(function(module) {
              var id = module.id
              if (/\0/.test(id)) return
              var desc = (watchFiles[id] || (watchFiles[id] = {
                entries: {}
              }))
              desc.entries[entry.id] = entry
            })
            rev()
          })
        })
      }
      return build(self, entry)
    })).then(function() {
      if (watch) {
        console.log('watch ', Object.keys(watchFiles))
        var watcher = gwatch(Object.keys(watchFiles), function(file) {

          console.log('change ', file.path, Object.keys(watchFiles), watchFiles[file.path])
          var desc = watchFiles[file.path]
          console.log('====>>>change ', file.path, dest)
          if (!desc) {
            virtualfilePlugin.removeFile(file.path)
            watcher.unwatch(file.path)
            return
          }
          if (file.contents) {
            virtualfilePlugin.setFile(file.path, file.contents.toString())
          } else {
            virtualfilePlugin.removeFile(file.path)
            watcher.unwatch(file.path)
          }
          var newWatchFiles = {},
            stream = gulp.src([])
          Promise.all(Object.keys(desc.entries).map(function(id) {
            var entry = desc.entries[id]
            return new Promise(function(rev, rej) {
              build(stream, entry).then(function(bundle) {
                var id = module.id
                if (/\0/.test(id)) return
                var desc = (newWatchFiles[id] || (newWatchFiles[id] = {
                  entries: {}
                }))
                desc.entries[entry.id] = entry
                rev()
              })
            })
          })).then(function() {
            var removes = [],
              adds = []
            for (var id in newWatchFiles) {
              if (!watchFiles[id]) {
                adds.push(id)
              }
            }
            for (var id in watchFiles) {
              if (!newWatchFiles[id]) {
                removes.add(id)
              }
            }
            watcher.add(adds)
            watcher.unwatch(removes)
            watchFiles = newWatchFiles
            watch(stream)
          })
        })
      }
      cb()
    }).catch(function(err) {
      setImmediate(function() {
        self.emit('error', new PluginError(PLUGIN_NAME, err))
        cb()
      })
    })
  }
}
util.inherits(GulpRollup, Transform)

function createFile(path, content) {
  var file = new gutil.File({
    path: path,
    contents: bufferFrom(content)
  })
  gutil.log(`Compile file ${gutil.colors.magenta(path)} (${size(content)})`)
  return file
}

function delProp(opt, prop) {
  var val = opt[prop]
  delete opt[prop]
  return val
}

function size(buf) {
  return gutil.colors.magenta((buf.length / 1024).toFixed(2) + 'kb')
}

module.exports = function(options) {
  return new GulpRollup(options)
}
