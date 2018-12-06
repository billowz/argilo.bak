const baseCfg = require('./karma.config')

module.exports = function(config) {
	baseCfg(config)
	config.set({
		frameworks: ['benchmark'],
		reporters: ['benchmark'],
		files: (process.env.specs || '*').split(',').map(v => `src/**/${v}.perf.ts`),
		preprocessors: {
			[`src/**/*.perf.ts`]: ['rollup', 'transformPath']
		},
		benchmarkReporter: {
			colors: config.colors
		},
		junitReporter: {
			outputDir: 'benchmark',
			outputFile: 'benchmark.xml'
		},
		browserNoActivityTimeout: 10 * 60 * 1000
	})
}
