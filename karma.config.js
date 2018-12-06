const nodeResolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const pkg = require('./package.json')

module.exports = function(config) {
	config.set({
		browsers: ['Chrome'],
		transports: ['websocket', 'polling', 'jsonp-polling'],
		frameworks: ['mocha', 'expect'],
		reporters: ['spec', 'coverage'],
		files: ['src/**/*.spec.ts'],
		preprocessors: {
			'src/**/*.spec.ts': ['rollup', 'transformPath']
		},
		rollupPreprocessor: {
			plugins: [
				nodeResolve({
					jsnext: true,
					extensions: ['.js', '.ts']
				}),
				commonjs(),
				babel({
					presets: [
						'@babel/preset-typescript',
						[
							'@babel/preset-env',
							{
								modules: false,
								loose: true
							}
						]
					],
					extensions: ['.js', '.ts']
				})
			],
			treeshake: false,
			external: ['expect.js'],
			output: {
				name: 'argilo',
				sourcemap: 'inline',
				format: 'umd',
				strict: false,
				globals: {
					'expect.js': 'expect'
				}
			}
		},
		transformPathPreprocessor: {
			transformer(filepath) {
				return filepath.replace(/\.ts$/, '.js')
			}
		},
		coverageReporter: {
			dir: './coverage/',
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
