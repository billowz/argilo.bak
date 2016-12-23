const babel = require('./babel.plugin'),
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
  entry: pkg.main,
  external: Object.keys(pkg.dependencies || {}),
  plugins: [alias({
    'ilos': path.resolve('src/ilos/index.js'),
    'observi': path.resolve('src/observi/index.js')
  }), localResolve(), babel()]
}
