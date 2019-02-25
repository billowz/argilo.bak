import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser as compress } from 'rollup-plugin-terser'
import jscc from 'rollup-plugin-jscc'
import prototypeMinify from 'rollup-plugin-prototype-minify'
import visualizer from 'rollup-plugin-visualizer'
import progress from 'rollup-plugin-progress'
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

const PROD = process.env.NODE_ENV === 'production'
export default [
	// development bundle
	config({
		output: umdOutput({
			file: `dist/${pkg.name}.dev.js`
		})
	}),

	// production bundle
	PROD &&
		config({
			output: umdOutput({
				file: `dist/${pkg.name}.js`
			})
		}),

	// commonjs && esmodule bundle
	PROD &&
		config({
			target: 'es6',
			output: [
				output({
					file: pkg.main,
					format: 'cjs'
				}),
				output({
					file: pkg.module,
					format: 'esm'
				})
			],
			babel: { targets: { browsers: 'chrome >= 59' } },
			external: Object.keys(pkg.dependencies || {})
		}),

	// production mini bundle
	PROD &&
		config({
			output: umdOutput({
				file: `dist/${pkg.name}.min.js`
			}),
			plugins: [
				compress({
					warnings: true,
					sourcemap: true,
					ie8: true,
					compress: {
						passes: 1,
						toplevel: true,
						typeofs: false
					},
					mangle: {
						properties: {
							regex: /^__\w*[^_]$/
							//debug: true
						}
					},
					output: {
						//beautify: true
					}
				}),
				visualizer({
					filename: './code-analysis.html',
					title: 'Argilo Bundle',
					sourcemap: false
				})
			]
		})
].filter(v => v)

function config(options) {
	const target = options.target || 'es3',
		babelOptions = options.babel || {},
		babelPlugins = babelOptions.plugins || [],
		babelPresets = babelOptions.presets || []

	delete options.target
	delete options.babel
	delete babelOptions.plugins
	delete babelOptions.presets

	return Object.assign({ input: './src/index.ts' }, options, {
		plugins: [
			nodeResolve({ jsnext: true, extensions: ['.js', '.ts'] }),
			commonjs(),
			babel({
				presets: [
					'@babel/preset-typescript',
					[
						'@babel/preset-env',
						Object.assign(
							{
								modules: false,
								loose: true
							},
							babelOptions
						)
					]
				].concat(babelPresets),
				plugins: babelPlugins,
				extensions: ['.js', '.ts']
			}),
			jscc({ values: { _TARGET: target } }),
			prototypeMinify({ sourcemap: true }),
			progress()
		].concat(options.plugins || [])
	})
}

function umdOutput(options) {
	return output(
		Object.assign(
			{
				name: pkg.namespace || pkg.name,
				strict: false,
				format: 'umd',
				amd: { id: pkg.name }
			},
			options
		)
	)
}

function output(options) {
	return Object.assign(
		{
			//banner,
			sourcemap: true
		},
		options
	)
}
