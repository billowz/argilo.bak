const baseCfg = require('./karma.config')
const istanbul = require('rollup-plugin-istanbul')

module.exports = function(config) {
	baseCfg(config)
	config.rollupPreprocessor.plugins.push(
		istanbul({
			exclude: ['src/**/__*__/**', 'node_modules/**']
		})
	)
	config.set({
		reporters: ['spec', 'istanbul'],
		istanbulReporter: {
			dir: './coverage/',
			reporters: [
				{
					type: 'lcov'
				},
				{
					type: 'text-summary'
				}
			]
		}
	})
}
