const rollupConfig = require('./config/rollupConfig'),
	pkg = require('./package.json')
const { assignIf } = rollupConfig

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

const input = './src/index.ts',
	outDir = './dist',
	moduleName = pkg.name,
	namespace = pkg.namespace || moduleName,
	browserConfig = {
		input,
		banner,
		outDir,
		target: 'es3',
		output: {
			format: 'umd',
			name: namespace,
			amd: moduleName,
			file: moduleName
		}
	},
	moduleConfig = {
		input,
		banner,
		outDir,
		target: 'es6',
		sourceRoot: '/' + moduleName,
		output: [
			{
				format: 'cjs',
				file: moduleName + '.cjs'
			},
			{
				format: 'esm',
				file: moduleName + '.esm'
			}
		],
		external: Object.keys(pkg.dependencies || {})
	}

module.exports = [browserConfig, moduleConfig]
	.concat(
		process.env.NODE_ENV === 'production' && [
			assignIf({ debug: false }, moduleConfig),
			assignIf({ debug: false }, browserConfig),
			assignIf({ debug: false, compact: true, codeAnalysis: true }, browserConfig)
		]
	)
	.filter(cfg => cfg)
	.map(cfg => rollupConfig(cfg))
