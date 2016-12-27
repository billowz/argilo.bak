var path = require('path')
var babel = require('rollup-plugin-babel'),
  localResolve = require('rollup-plugin-local-resolve'),
  alias = require('rollup-plugin-alias'),
  postcss = require('rollup-plugin-postcss'),
  uglify = require('rollup-plugin-uglify'),
  multiEntry = require('rollup-plugin-multi-entry'),
  istanbul = require('rollup-plugin-istanbul')

// PostCSS plugins
var simplevars = require('postcss-simple-vars'),
  nested = require('postcss-nested'),
  cssnext = require('postcss-cssnext'),
  cssnano = require('cssnano'),
  mixins = require('postcss-sassy-mixins')

module.exports = {
  get(names) {
    var plugins = this.plugins
    return names.map(function(name) {
      if (typeof name === 'string') {
        var plugin = plugins[name]
        return plugin && plugin()
      }
      return name
    }).filter(function(plugin) {
      return plugin
    })
  },
  plugins: {
    alias: function() {
      return alias({
        'ilos': path.resolve('src/ilos/index.js'),
        'observi': path.resolve('src/observi/index.js')
      })
    },
    resolve: function() {
      return localResolve()
    },
    babel: function() {
      return babel({
        runtimeHelpers: false,
        presets: ["es2015-loose-rollup"],
        plugins: [
          "transform-es3-member-expression-literals",
          "transform-es3-property-literals"
        ]
      })
    },
    uglify: function() {
      return uglify()
    },
    css: function() {
      return postcss({
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
    },
    multiEntry: function() {
      return multiEntry()
    },
    istanbul: function() {
      return istanbul({
        exclude: ['**/__tests__/*.spec.js', 'node_modules/**']
      })
    }
  }
}
