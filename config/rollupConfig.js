const path = require('path'),
	babelPlugin = require('rollup-plugin-babel'),
	nodeResolve = require('rollup-plugin-node-resolve'),
	commonjs = require('rollup-plugin-commonjs'),
	terser = require('rollup-plugin-terser').terser,
	jscc = require('rollup-plugin-jscc'),
	prototypeMinify = require('rollup-plugin-prototype-minify'),
	visualizer = require('rollup-plugin-visualizer'),
	progress = require('rollup-plugin-progress')

const ci = process.env.ci
const configOptions = mkMap(
		'target,debug,compact,strict,sourcemap,sourceRoot,outDir,extensions,banner,footer,babel,progress,codeAnalysis'
	),
	babelConfigOptions = mkMap('plugins,presets')

/**
 *
 * @param {*}					config...								rollup configuration
 * @param {"es3"|"es5"|"es6"} 	[config.target="es3"]					config target
 * @param {boolean}				[config.debug=true]						debug mode
 * @param {string[]}			[config.extensions=[".js",".ts"]]		file extensions
 * @param {boolean}				[config.sourcemap=true]					enable source map
 * @param {*}					[config.compact=false]					compact bundle
 * @param {boolean}				[config.progress=true]					show progress
 * @param {boolean}				[config.strict=true]					strict
 * @param {string}				config.sourceRoot						root path of source map
 * @param {string}				config.outDir							out dir
 * @param {string}				config.codeAnalysis						code analysis file
 * @param {string}				config.banner							banner
 * @param {string}				config.footer							banner
 * @param {*}					config.babel							babel configuration
 * @param {any[]}				config.babel.presets					babel presets
 * @param {any[]}				config.babel.plugins					babel plugins
 * @param {*}					config.babel...							preset-env configuration
 */
function mkConfig(config) {
	const target = config.target || 'es3',
		debug = config.debug !== false,
		extensions = config.extensions || ['.js', '.ts'],
		banner = config.banner,
		footer = config.footer,
		sourcemap = config.sourcemap === undefined ? true : config.sourcemap,
		compact = config.compact,
		codeAnalysis = config.codeAnalysis,
		es3 = target === 'es3',
		es5 = target === 'es5',
		es6 = target === 'es6'

	const rollup = assignBy({}, k => !configOptions[k], config),
		babelPresetENV = assignBy(
			{
				modules: false,
				loose: es3,
				useBuiltIns: false,
				spec: false,
				targets: es6
					? {
							chrome: '59'
					  }
					: es5
					? {
							ie: '9'
					  }
					: {
							ie: '6'
					  }
			},
			k => !babelConfigOptions[k],
			config.babel
		)

	const { plugins: babelPlugins = [], presets: babelPresets = [] } = config.babel || {}

	if (!Array.isArray(rollup.output)) rollup.output = [rollup.output]
	rollup.output = rollup.output
		.filter(o => !!o)
		.map(output => {
			output = Object.assign({}, output)
			const amdModule = /^(?:amd|umd)$/.test(output.format)
			if (amdModule && (!output.amd || typeof output.amd !== 'object')) {
				output.amd = { id: typeof output.amd === 'string' ? output.amd : output.name }
			}

			if (!output.file) {
				delete output.file
			} else {
				if (!/\.js$/.test(output.file)) {
					output.file = `${output.file}${debug ? '.dev' : ''}${compact ? '.min' : ''}.js`
				}
				config.outDir && (output.file = path.join(config.outDir, output.file))
			}
			assignIf(output, {
				banner,
				footer,
				sourcemap,
				strict: config.strict !== false,
				esModule: !es3,
				freeze: !es3,
				compact: !!compact
			})

			let sourceRoot =
				output.sourceRoot ||
				config.sourceRoot ||
				(amdModule ? '/' + output.amd.id : output.name && '/' + output.name)
			delete output.sourceRoot

			const sourcemapPathTransform = output.sourcemapPathTransform
			output.sourcemapPathTransform = p => {
				if (sourceRoot) {
					p = path.join(sourceRoot, p.replace(/^(?:\.\.[\/\\])+/, ''))
				}
				return sourcemapPathTransform ? sourcemapPathTransform(p) : p
			}
			return output
		})
	if (rollup.output.length < 2) rollup.output = rollup.output[0]

	return Object.assign({}, rollup, {
		plugins: [
			nodeResolve({ mainFields: ['module', 'main'], extensions }),
			commonjs(),
			babelPlugin({
				presets: ['@babel/preset-typescript', ['@babel/preset-env', babelPresetENV]].concat(babelPresets),
				plugins: babelPlugins,
				extensions
			}),
			//jscc({ values: { _TARGET: target, _DEBUG: debug } }),
			!ci && config.progress !== false && progress()
		]
			.concat(rollup.plugins || [])
			.concat([
				/* prototypeMinify({
					sourcemap: !!sourcemap
				}), */
				compact &&
					terser(
						Object.assign(
							{
								warnings: true,
								sourcemap: !!sourcemap,
								ie8: es3,
								mangle: {
									properties: {
										regex: /^__\w*[^_]$/
									}
								}
							},
							compact,
							{
								compress: Object.assign(
									{
										passes: 1,
										toplevel: true,
										typeofs: false
									},
									compact.compress
								)
							}
						)
					),
				!ci && codeAnalysis &&
					visualizer({
						filename:
							typeof codeAnalysis === 'string'
								? codeAnalysis.replace(/\.html$/, '') + '.html'
								: 'analysis/bundle.html',
						sourcemap: !!sourcemap
					})
			])
			.filter(p => !!p)
	})
}
module.exports = mkConfig
mkConfig.assignBy = assignBy
mkConfig.assignIf = assignIf

function assignBy(target = {}, filter) {
	for (let i = 2, l = arguments.length; i < l; i++) {
		const o = arguments[i]
		if (o) {
			for (const k in o) {
				if (Object.prototype.hasOwnProperty.call(o, k) && filter(k, target, o)) {
					target[k] = o[k]
				}
			}
		}
	}
	return target
}

function assignIf(target, ...args) {
	return assignBy.apply(null, [target, (k, t) => !(k in t)].concat(args))
}

function mkMap(str) {
	const map = {}
	str.split(/\s*,\s*/g).forEach(v => {
		map[v] = true
	})
	return map
}
