const json = require('rollup-plugin-json'),
	rollupConfig = require('./rollupConfig'),
	pkg = require('../package.json')

const ci = process.env.ci
module.exports = function(config) {
	config.set({
		browsers: ['Chrome'],
		transports: ['websocket', 'polling', 'jsonp-polling'],
		frameworks: ['mocha'],
		reporters: ['spec', 'coverage'],
		files: (process.env.specs || '*')
			.split(',')
			.map(v => `../src/**/${v}.spec.ts`)
			.concat(['../src/index.ts']),
		preprocessors: {
			'../src/**/*.ts': ['rollup']
		},
		rollupPreprocessor: {
			options: rollupConfig({
				plugins: [json()],
				progress: !ci,
				sourcemap: !ci && 'inline',
				output: {
					name: 'argilo',
					format: 'umd',
					file: false
				}
			}),
			transformPath(filepath) {
				return filepath.replace(/\.ts$/, '.js')
			}
		},
		coverageReporter: {
			dir: '../coverage/',
			reporters: [
				{
					type: 'lcov'
				}
			].concat(ci ? [] : [
				{
					type: 'text'
				}
			])
		},
		customLaunchers: {
			IE9: {
				base: 'IE',
				'x-ua-compatible': 'IE=EmulateIE9'
			},
			IE8: {
				base: 'IE',
				'x-ua-compatible': 'IE=EmulateIE8'
			}
		},
		singleRun: !!ci,
		concurrency: Infinity,
		colors: true,
		client: {
			clearContext: false,
			captureConsole: false,
			mocha: {
				reporter: 'html',
				ui: 'bdd'
			}
		},
		plugins: ['karma-*']
	})
}
