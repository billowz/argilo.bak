var path = require('path');

function isAbsolute(p) {
  return path.isAbsolute(p) || /^[A-Za-z]:(\/|\\)/.test(p);
}

function absolutify(p, cwd) {
  if (cwd) {
    return path.join(cwd, p);
  } else {
    return './' + p;
  }
}

module.exports = function rollupPluginVirtualfile(options) {
  options = options || {};
  var files0 = options.files || {},
    allowRealFiles = options.allowRealFiles !== false,
    allowExternalModules = options.allowExternalModules !== false,
    leaveIdsAlone = options.leaveIdsAlone !== false,
    impliedExtensions = options.impliedExtensions || ['.js'],
    files;

  var cwd = options.cwd;
  if (cwd !== false) {
    if (cwd === undefined)
      cwd = process.cwd();
  }

  if (leaveIdsAlone) {
    files = (files0 && Object.assign({}, files0)) || {}
  } else {
    for (var f in files0) {
      var p = path.normalize(f);
      if (!isAbsolute(p))
        p = absolutify(p, cwd);
      files[p] = files0[f];
    }
  }

  function resolveId(importee, importer) {
    if (importee in files)
      return importee;

    if (!isAbsolute(importee) && importer) {
      importee = path.join(path.dirname(importer), importee)
    } else {
      importee = path.normalize(importee);
      if (!isAbsolute(importee))
        importee = absolutify(importee, cwd);
    }

    if (importee in files)
      return importee;

    for (var i = 0, len = impliedExtensions.length; i < len; ++i) {
      var extended = importee + impliedExtensions[i];
      if (extended in files)
        return extended;
    }
  }

  return {
    resolveId: resolveId,
    putFile: function(f, content) {
      if (leaveIdsAlone) {
        if (files[f] === content)
          return false;
        files[f] = content
      } else {
        var p = path.normalize(f);
        if (!isAbsolute(p)) {
          p = absolutify(p, cwd);
        }
        if (files[p] === content)
          return false;
        files[p] = content;
      }
      return true
    },
    removeFile: function(f) {
      delete files[f]
    },
    load: function(id) {
      var f
      if (id in files) {
        f = files[id];
      } else {
        id = resolveId(id);
        f = id && files[id];
      }
      return f
    }
  };
}
