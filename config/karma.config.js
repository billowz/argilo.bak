const json = require('rollup-plugin-json'),
	rollupConfig = require('./rollupConfig'),
	pkg = require('../package.json')

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
			'../src/**/*.ts': ['rollup', 'transformPath']
		},
		rollupPreprocessor: rollupConfig({
			plugins: [json()],
			progress: false,
			//treeshake: false,
			sourcemap: 'inline',
			output: {
				name: 'argilo',
				format: 'umd',
				file: false
			}
		}),
		transformPathPreprocessor: {
			transformer(filepath) {
				return filepath.replace(/\.ts$/, '.js')
			}
		},
		coverageReporter: {
			dir: '../coverage/',
			reporters: [
				{
					type: 'lcov'
				},
				{
					type: 'text'
				}
			]
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
		plugins: Object.keys(pkg.devDependencies)
			.filter(name => {
				return /^karma-/.test(name)
			})
			.map(name => require(name))
	})
}
