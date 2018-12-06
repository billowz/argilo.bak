import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import visualizer from 'rollup-plugin-visualizer'
import prototypeMinify from 'rollup-plugin-prototype-minify'
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

	// production mini bundle
	PROD &&
		config({
			output: umdOutput({
				file: `dist/${pkg.name}.min.js`
			}),
			plugins: [
				uglify({
					warnings: true,
					sourcemap: true,
					ie8: true
				}),
				visualizer({
					filename: 'analysis/code-analysis.html',
					title: pkg.name,
					sourcemap: true
				})
			]
		}),

	// commonjs && esmodule bundle
	PROD &&
		config({
			external: Object.keys(pkg.dependencies || {}),
			output: [
				output({
					file: pkg.main,
					format: 'cjs'
				}),
				output({
					file: pkg.module,
					format: 'esm'
				})
			]
		})
].filter(v => v)

function config(options) {
	return Object.assign({ input: './src/index.ts' }, options, {
		plugins: [
			nodeResolve({ jsnext: true, extensions: ['.js', '.ts'] }),
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
			}),
			prototypeMinify({ sourcemap: true }),
			filesize(),
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
			banner,
			sourcemap: true
		},
		options
	)
}
