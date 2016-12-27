var baseCfg = require('./karma.config')
var rollupPlugins = require('./rollup.plugins.config')

module.exports = function(config) {
  baseCfg(config)
  var rp = config.rollupPreprocessor
  rp.rollup.plugins = rollupPlugins.get(['multiEntry', 'resolve', 'alias', 'istanbul', 'babel'])
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
