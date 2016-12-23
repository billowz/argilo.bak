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
  gutil = require('gulp-util'),
  gfile = require('gulp-file'),
  Transform = require('readable-stream').Transform,
  path = require('path'),
  bufferFrom = require('buffer-from'),
  virtualfile = require('./rollup-plugin-virtualfile');

var PluginError = gutil.PluginError;

function GulpRollup(options) {
  var self = this;

  Transform.call(self, {
    objectMode: true
  });



  var wonderland = {},
    vinylFiles = {};
  var haveSourcemaps;

  var entryFiles = Promise.resolve(options.entry).then(function(entryFiles) {
    if (typeof entryFiles === 'string') {
      return [{
        entry: entryFiles
      }];
    } else if (Array.isArray(entryFiles)) {
      return entryFiles.map(function(entryFile) {
        if (typeof entryFiles === 'string') {
          return {
            entry: entryFile
          }
        } else if (entryFile && entryFile.entry) {
          return entryFile
        }
      });
    } else if (entryFiles) {
      return Object.keys(entryFiles).map(function(entryFile) {
        var val = entryFiles[entryFile]
        if (typeof val === 'string') {
          val = {
            dest: val
          }
        }
        return Object.assign({
          entry: entryFile
        }, val)
      })
    } else {
      return []
    }
  });

  self._transform = function(file, enc, cb) {
    if (!file.isBuffer()) {
      self.emit('error', new PluginError(PLUGIN_NAME, 'Input files must be buffered!'));
      return cb();
    }

    if (haveSourcemaps === undefined) {
      haveSourcemaps = file.sourceMap !== undefined;
    } else if (haveSourcemaps !== (file.sourceMap !== undefined)) {
      self.emit('error', new PluginError(PLUGIN_NAME, 'Mixing of sourcemapped and non-sourcemapped files!'));
      return cb();
    }

    if (haveSourcemaps) {
      wonderland[file.path] = {
        code: file.contents.toString(),
        map: file.sourceMap
      };
    } else {
      wonderland[file.path] = file.contents.toString();
    }
    cb();
  };

  self._flush = function(cb) {
    var virtualfilePlugin = virtualfile({
      files: wonderland
    })
    entryFiles.then(function(entryFiles) {
      return Promise.all(entryFiles.map(function(entryFile) {
        var dest = entryFile.dest || entryFile.entry,
          opt = Object.assign({
            sourceMap: haveSourcemaps
          }, entryFile),
          pluginMap = options.pluginMap;

        if (!('plugins' in opt))
          opt.plugins = options.plugins || []

        var files = {}
        opt.plugins = (opt.plugins || []).concat([virtualfilePlugin, {
            transform: function(code, id) {
              files[id] = true
            }
          }])
          .map(function(plugin) {
            if (!plugin) return null
            if (typeof plugin === 'string')
              return pluginMap && pluginMap[plugin]
            return plugin
          })
          .filter(function(plugin) {
            return plugin
          });

        for (var key in options) {
          if (key !== 'pluginMap' && !(key in opt))
            opt[key] = options[key]
        }
        if (opt.module) {
          opt.moduleId = opt.moduleName = opt.module
          delete opt.module
        }
        return rollup.rollup(opt).then(function(bundle) {
          var result = bundle.generate(opt);

          var file = new gutil.File({
            path: dest,
            contents: bufferFrom(result.code)
          });

          var map = result.map;
          if (map) {
            map.file = file.relative;
            map.sources = map.sources.map(function(fileName) {
              return path.relative(file.base, fileName);
            });
            file.sourceMap = map;
          }
          console.log(Object.keys(files))
          self.push(file);
        });
      }));
    }).then(function() {
      cb(); // it's over!
    }).catch(function(err) {
      setImmediate(function() {
        self.emit('error', new PluginError(PLUGIN_NAME, err));
        cb();
      });
    });
  };
}
util.inherits(GulpRollup, Transform);

function unixStylePath(filePath) {
  return filePath.split(path.sep).join('/');
}

module.exports = function(options) {
  return new GulpRollup(options);
};
