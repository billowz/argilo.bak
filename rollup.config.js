import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'
import visualizer from 'rollup-plugin-visualizer'

import pkg from './package.json'

const banner = `/*
 *    __ _ _ __ __ _(_) | ___
 *   / _\` | '__/ _\` | | |/ _ \\
 *  | (_| | | | (_| | | | (_) |
 *   \\__,_|_|  \\__, |_|_|\\___/
 *             |___/
 *
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 *
 * Copyright (c) 2018 ${pkg.author}
 * Released under the ${pkg.license} license
 *
 * Date: ${new Date().toUTCString()}
 */`

function config(options, babelOptions = {}) {
	return Object.assign({ input: './src/index.js' }, options, {
		plugins: [filesize(), resolve({ jsnext: true }), babel(babelOptions)].concat(options.plugins || [])
	})
}

function umd(options) {
	return Object.assign(
		{
			banner,
			sourcemap: true,
			name: pkg.namespace || pkg.name,
			strict: true,
			legacy: true,
			format: 'umd',
			amd: { id: pkg.name }
		},
		options
	)
}

const prodBabelOptions = {
	plugins: [
		[
			'unimport',
			{
				library: {
					devlevel: ['log', 'debug', 'info', 'warn', 'error']
				}
			}
		]
	]
}
export default [
	// development
	config({
		output: umd({
			file: `dist/${pkg.name}.dev.js`
		})
	})
].concat(
	process.env.NODE_ENV === 'production'
		? [
				// production
				// modules
				config({
					external: Object.keys(pkg.dependencies || {}),
					output: [
						{
							banner,
							file: pkg.main,
							format: 'cjs',
							sourcemap: true
						},
						{
							banner,
							file: pkg.module,
							format: 'esm',
							sourcemap: true
						}
					]
				}),
				config(
					{
						output: umd({
							file: `dist/${pkg.name}.js`
						})
					},
					prodBabelOptions
				),
				config(
					{
						output: umd({
							file: `dist/${pkg.name}.min.js`
						}),
						plugins: [
							uglify({
								warnings: true,
								sourcemap: true,
								ie8: true
							}),
							visualizer({
								filename: 'code-analysis.html'
							})
						]
					},
					prodBabelOptions
				)
		  ]
		: []
)
