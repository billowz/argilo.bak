const babel = require('rollup-plugin-babel'),
  localResolve = require('rollup-plugin-local-resolve'),
  alias = require('rollup-plugin-alias'),
  path = require('path'),
  pkg = require('../package.json'),
  banner = `/*
 * ${pkg.name} v${pkg.version} built in ${new Date().toUTCString()}
 * Copyright (c) 2016 ${pkg.author}
 * Released under the ${pkg.license} license
 * support IE6+ and other browsers
 * ${pkg.homepage}
 */`
module.exports = {
  rollup: { // rollup config, see https://github.com/rollup/rollup/wiki/JavaScript-API
    entry: pkg.main,
    external: Object.keys(pkg.dependencies || {}),
    plugins: [alias({
      'ilos': path.resolve('src/ilos/index.js'),
      'observi': path.resolve('src/observi/index.js')
    }), localResolve(), babel({
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
    dest: pkg.dist,
    mini: true,
    gzip: true,
    format: 'umd',
    moduleId: pkg.namespace,
    moduleName: pkg.namespace,
    banner: banner,
    sourceMap: true,
    useStrict: false
  }
}
