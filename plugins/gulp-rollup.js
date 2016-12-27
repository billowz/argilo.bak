/**
 * "buffer-from": "^0.1.0",
 * "gulp-util": "^3.0.6",
 * "readable-stream": "^2.1.4",
 * "rollup": "^0.36.0",
 * "through2": "^2.0.3"
 * "gulp-watch": "^4.3.11",
 * "zlib": "^1.0.5"
 * rollup-plugin-virtualfile
 */
var PLUGIN_NAME = 'gulp-rollup',
  fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Transform = require('readable-stream').Transform,
  bufferFrom = require('buffer-from'),
  zlib = require('zlib'),
  rollup = require('rollup'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  gwatch = require('gulp-watch'),
  through2 = require('through2'),
  virtualfile = require('./rollup-plugin-virtualfile')

var PluginError = gutil.PluginError

function build(stream, entry) {
  var opt = entry.option,
    dest = entry.dest,
    sourceRoot = entry.sourceRoot,
    sourceMap = entry.sourceMap,
    gzip = entry.gzip
  var start = new Date()
  return rollup.rollup(opt).then(function(bundle) {
    opt.cache = bundle
    console.log(new Date() - start)
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
    console.log(new Date() - start)
    return Promise.resolve(bundle)
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
    watchSrc = delProp(options, 'watchSrc'),
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
      var name = delProp(opt, 'name') || opt.dest
      return {
        id: i,
        dest: opt.dest || opt.entry,
        name: name,
        colorName: gutil.colors.cyan(name),
        sourceMap: sourceMap,
        sourceRoot: delProp(opt, 'sourceRoot'),
        gzip: delProp(opt, 'gzip'),
        option: opt
      }
    })

    var entryColorNames = Object.keys(entries).map(function(i) {
      return entries[i].colorName
    }).join(', ')

    function needWatch(file, watchs, entry) {
      if (/\0/.test(file)) return false
      var desc = (watchs[file] || (watchs[file] = {
        entries: {},
        size: 0,
        add: function(entry) {
          if (!this.entries[entry.id]) {
            this.entries[entry.id] = entry
            this.size++
          }
        },
        remove: function(ids) {
          var es = this.entries
          var self = this
          ids.forEach(function(id) {
            if (es[id]) {
              es[id] = undefined
              self.size--
            }
          })
        }
      }))
      desc.add(entry)
      return true
    }

    function checkBundleWatchs(bundle, watchs, entry) {
      bundle.modules.forEach(function(module) {
        needWatch(module.id, watchs, entry)
      })
    }

    var watchFiles = watch && {}
    var rebuilding = false,
      needRebuild = false

    function checkRebuild() {
      if (needRebuild) {
        var es = needRebuild
        needRebuild = false
        return rebuild(es, watcher)
      }
    }

    function rebuild(entries, watcher) {
      if (rebuilding) {
        gutil.log('rebuilding...')
        needRebuild = Object.assign(needRebuild || {}, entries)
        return Promise.reject()
      }
      var entryColorNames = Object.keys(entries).map(function(i) {
        return entries[i].colorName
      }).join(', ')

      gutil.log(`Rebuilding entries['${entryColorNames}']...`)
      var start = new Date()
      rebuilding = true
      var newWatchFiles = {},
        stream = through2.obj(function(file, err, cb) {
          this.push(file)
          cb()
        }),
        printErr = true,
        entryIds = Object.keys(entries)

      return Promise.all(entryIds.map(function(id) {
        var entry = entries[id]
        gutil.log(`Rebuilding entry['${entry.colorName}']...`)
        var start = new Date()
        return build({
          push: function(f) {
            stream.write(f)
          }
        }, entry).then(function(bundle) {
          gutil.log(`Rebuild entry['${entry.colorName}'] use ${colorTime(new Date() - start)}`)
          checkBundleWatchs(bundle, newWatchFiles, entry)
          return Promise.resolve()
        }).catch(function(err) {
          gutil.log(`Rebuild entry[${entry.colorName}] failed:\n`, err)
          printErr = false
          throw err
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
            desc = watchFiles[id]
            desc.remove(entryIds)
            if (desc.size) {
              newWatchFiles[id] = watchFiles[id]
            } else {
              removes.push(id)
            }
          }
        }
        if (adds.length) {
          watcher.add(adds)
          gutil.log(`Watch Sources: \n\t${adds.join('\n\t')}`)
        }
        if (removes.length) {
          watcher.unwatch(removes)
          gutil.log(`Unwatch Sources: \n\t${removes.join('\n\t')}`)
        }
        watchFiles = newWatchFiles

        var k = 0

        function done() {
          if (k++) return
          gutil.log(`Rebuild Entries['${entryColorNames}'] use ${colorTime(new Date()-start)}`)
          rebuilding = false
          checkRebuild(watcher)
        }
        var s = watch(stream, done)
        if (s) s.on('end', done)
        stream.end()
      }).catch(function(err) {
        if (printErr)
          gutil.log(`Rebuild entries[${entryColorNames}] failed:\n`, err)
        stream.end()
        rebuilding = false
        checkRebuild(watcher)
        throw err
      })
    }
    gutil.log(`Building entries[${entryColorNames}]...`)
    var start = new Date(),
      printErr = true
    Promise.all(entries.map(function(entry) {
      gutil.log(`Building entry['${entry.colorName}']...`)
      var start = new Date()
      return build(self, entry).then(function(bundle) {
        gutil.log(`Build entry['${entry.colorName}'] use ${colorTime(new Date()- start)}`)
        if (watch) {
          checkBundleWatchs(bundle, watchFiles, entry)
        }
        return Promise.resolve()
      }).catch(function(err) {
        gutil.log(`Build entry[${entry.colorName}] failed:\n`, err)
        printErr = false
        throw err
      })
    })).then(function() {
      if (watch) {
        var watchFilePaths = Object.keys(watchFiles)
        var hasError = false
        gutil.log(`Watching ${watchFilePaths.length} sources:\n\t${watchFilePaths.join('\n\t')}`)
        var start2 = new Date()
        var rebuilding = false,
          needRebuild = false
        var watcher = gwatch(watchFilePaths, function(file) {
          var colorPath = gutil.colors.magenta(file.path)
          var desc = watchFiles[file.path]
          if (!desc) {
            virtualfilePlugin.removeFile(file.path)
            watcher.unwatch(file.path)
            return
          }
          if (file.event == 'unlink') {
            virtualfilePlugin.removeFile(file.path)
            watcher.unwatch(file.path)
          } else if (!virtualfilePlugin.putFile(file.path, file.contents.toString())) {
            return
          }
          gutil.log(`Source ${file.event} ${colorPath}`)
          rebuild(desc.entries, watcher).then(function() {
            hasError = false
          }).catch(function(err) {
            hasError = true
          })
        })
        gutil.log(`Watch ${watchFilePaths.length} sources use ${colorTime(new Date() - start2)}`)
        if (watchSrc) {
          gwatch(watchSrc, function(file) {
            if (hasError && file.type != 'unlink') {
              entries.forEach(function(entry) {
                needWatch(file.path, watchFiles, entry)
              })
              watcher.add(file.path)
              gutil.log(`Watch Sources: ${file.path}`)
              if (!rebuilding)
                rebuild(watchFiles[file.path].entries, watcher)
            }
          })
          gutil.log(`Watch sources: ${watchSrc}`)
        }
      }
      gutil.log(`Build entries[${entryColorNames}] use ${colorTime(new Date() - start)}`)
      cb()
    }).catch(function(err) {
      if (printErr)
        gutil.log(`Build entries[${entryColorNames}] failed:\n`, err)
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

function colorTime(use) {
  if (use > 1000) {
    use = (use / 1000).toFixed(2) + ' s'
  } else {
    use = use + ' ms'
  }
  return gutil.colors.magenta(use)
}
module.exports = function(options) {
  return new GulpRollup(options)
}
