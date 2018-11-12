const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const builtins = require('rollup-plugin-node-builtins')
const babel = require('rollup-plugin-babel')
const { devDependencies } = require('./package.json')

module.exports = function(config) {
	config.set({
		browsers: ['Chrome'],
		transports: ['websocket', 'polling', 'jsonp-polling'],
		frameworks: ['mocha', 'expect'],
		reporters: ['spec'],
		files: [].concat((process.env.specs || '*').split(',').map(v => `src/**/${v}.spec.js`)),
		preprocessors: {
			[`src/**/*.spec.js`]: ['rollup']
		},
		rollupPreprocessor: {
			plugins: [
				resolve({
					jsnext: true
				}),
				babel({})
			],
			output: {
				sourcemap: 'inline',
				format: 'iife',
				strict: false
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
		plugins: Object.keys(devDependencies)
			.filter(name => {
				return /^karma-/.test(name)
			})
			.map(name => require(name))
	})
}
