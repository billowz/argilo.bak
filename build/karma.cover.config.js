var baseCfg = require('./karma.config'),
  istanbul = require('rollup-plugin-istanbul')

module.exports = function(config) {
  baseCfg(config)
  var rp = config.rollupPreprocessor
  rp.rollup.plugins = [istanbul({
    exclude: ['**/__tests__/*.spec.js', 'node_modules/**']
  })].concat(rp.rollup.plugins)
  rp.bundle.sourceMap = false
  config.set({
    istanbulReporter: {
      dir: '../coverage/',
      reporters: [{
        type: 'lcov'
      }, {
        type: 'text-summary'
      }]
    }
  })
}
