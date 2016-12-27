var rollupPlugins = require('./rollup.plugins.config')
module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    singleRun: true,
    transports: ['websocket', 'polling', 'jsonp-polling'],
    frameworks: ['mocha', 'expect'],
    reporters: ['spec', 'istanbul'],
    files: ['src/**/*.spec.js'],
    preprocessors: {
      'src/**/*.spec.js': ['rollup']
    },
    rollupPreprocessor: {
      rollup: {
        plugins: rollupPlugins.get(['multiEntry', 'resolve', 'alias', 'babel'])
      },
      bundle: {
        sourceMap: true,
        useStrict: false,
        format: 'iife',
        moduleId: 'argilo',
        moduleName: 'argilo'
      }
    },
    autoWatch: true,
    concurrency: Infinity,
    client: {
      clearContext: false,
      captureConsole: false,
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
        ui: 'bdd'
      }
    },
    colors: true
  })
}
