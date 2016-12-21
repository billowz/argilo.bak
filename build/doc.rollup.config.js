const babel = require('rollup-plugin-babel'),
  localResolve = require('rollup-plugin-local-resolve'),
  alias = require('rollup-plugin-alias'),
  path = require('path'),
  pkg = require('../package.json'),
  banner = `/*
 * ${pkg.name}-document v${pkg.version} built in ${new Date().toUTCString()}
 * Copyright (c) 2016 ${pkg.author}
 * Released under the ${pkg.license} license
 * support IE6+ and other browsers
 * ${pkg.homepage}
 */`,
  globals = {}
globals[pkg.namespace] = pkg.namespace
module.exports = {
  rollup: { // rollup config, see https://github.com/rollup/rollup/wiki/JavaScript-API
    entry: 'src/doc/index.js',
    external: Object.keys(pkg.dependencies || {}).concat([pkg.namespace]),
    plugins: [localResolve(), babel({
      runtimeHelpers: false,
      presets: ["es2015-loose-rollup"],
      plugins: [
        "transform-es3-member-expression-literals",
        "transform-es3-property-literals"
      ]
    })]
  },
  bundle: { // rollup bundle generate config, see https://github.com/rollup/rollup/wiki/JavaScript-API
    exports: 'default',
    dest: pkg.dist.replace(/\.js$/, '.doc.js'),
    mini: true,
    gzip: true,
    format: 'umd',
    moduleId: pkg.namespace + 'Doc',
    moduleName: pkg.namespace + 'Doc',
    banner: banner,
    sourceMap: true,
    useStrict: false,
    globals: globals
  }
}
