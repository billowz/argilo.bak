// @flow
/**
 *
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 19:16:21 GMT+0800 (China Standard Time)
 */
import { error } from 'devlevel'
import { global, create, hasOwnProp } from '../helper'

export default function(defaultPropMap) {
	if (
		!(function() {
			if (global && global.VBArray) {
				try {
					global.execScript(
						['Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function'].join('\n'),
						'VBScript'
					)
					return true
				} catch (e) {
					error(e.message, e)
				}
			}
			return false
		})()
	)
		return false

	const bindingProp = '__vbclass_binding__',
		constructorProp = '__vbclass_constructor__'
	const objectProps = 'hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(','),
		classPool = create(null),
		constructorScript = [
			'\tPublic [',
			bindingProp,
			']\r\n',
			'\tPublic Default Function [',
			constructorProp,
			'](source)\r\n',
			'\t\tSet [',
			bindingProp,
			'] = source\r\n',
			'\t\tSet [',
			constructorProp,
			'] = Me\r\n',
			'\tEnd Function\r\n\n'
		].join('')

	let classNameGenerator = 1

	function parseGetter(prop, buffer) {
		buffer.push.call(
			buffer,
			'\tPublic Property Let [',
			prop,
			'](val)\r\n',
			'\t\tCall [',
			bindingProp,
			'].doWrite("',
			prop,
			'",val)\r\n',
			'\tEnd Property\r\n',
			'\tPublic Property Set [',
			prop,
			'](val)\r\n',
			'\t\tCall [',
			bindingProp,
			'].doWrite("',
			prop,
			'",val)\r\n',
			'\tEnd Property\r\n\r\n'
		)
	}

	function parseSetter(prop, buffer) {
		buffer.push.call(
			buffer,
			'\tPublic Property Get [',
			prop,
			']\r\n',
			'\tOn Error Resume Next\r\n',
			'\t\tSet[',
			prop,
			'] = [',
			bindingProp,
			'].doRead("',
			prop,
			'")\r\n',
			'\tIf Err.Number <> 0 Then\r\n',
			'\t\t[',
			prop,
			'] = [',
			bindingProp,
			'].doRead("',
			prop,
			'")\r\n',
			'\tEnd If\r\n',
			'\tOn Error Goto 0\r\n',
			'\tEnd Property\r\n\r\n'
		)
	}

	function parseVBClass(className, props) {
		let buffer = ['Class ', className, '\r\n', constructorScript, '\r\n'],
			prop

		for (var i = 0, l = props.length; i < l; i++) {
			prop = props[i]
			parseSetter(prop, buffer)
			parseGetter(prop, buffer)
		}
		buffer.push('End Class')
		return buffer.join('')
	}

	function getOrCreateVBClass(props) {
		let classKey = [props.sort().join('|')].join(''),
			providerName = classPool[classKey]
		if (!providerName) {
			var className = 'VBClass' + classNameGenerator++
			providerName = className + 'Provider'
			parseVB(parseVBClass(className, props))
			parseVB(
				[
					'Function ',
					providerName,
					'(desc)\r\n',
					'\tDim o\r\n',
					'\tSet o = (New ',
					className,
					')(desc)\r\n',
					'\tSet ',
					providerName,
					' = o\r\n',
					'End Function'
				].join('')
			)
			classPool[classKey] = providerName
		}
		return providerName
	}

	function createProxy(source, vbproxy) {
		let propMap = create(null),
			props = [],
			prop

		for (var i = 0, l = objectProps.length; i < l; i++) {
			prop = objectProps[i]
			propMap[prop] = true
			props[i] = prop
		}

		for (prop in source) {
			if (!propMap[prop]) {
				props.push(prop)
				propMap[prop] = true
			}
		}

		for (prop in defaultPropMap) {
			if (defaultPropMap[prop] && !propMap[prop]) {
				source[prop] = undefined
				propMap[prop] = true
				props.push(prop)
			}
		}
		return global[getOrCreateVBClass(props)](vbproxy)
	}

	function buildProxy(observer) {
		let source = observer.source,
			proxy = (observer.proxy = createProxy(source, observer)),
			funcs = (observer.funcs = create(null)),
			func
		for (var prop in source) {
			func = source[prop]
			if (typeof func === 'function') funcs[prop] = func.bind(proxy)
		}
	}
	return {
		name: 'VBProxy',
		proxyEnabled: true,
		proxyChangeable: true,
		sourceOwnProperty: true,
		impl: {
			__init() {
				buildProxy(this)
			},
			__watch(attr) {
				if (!(attr in this.proxy)) {
					buildProxy(this)
					this.__proxyChanged()
				}
			},
			doWrite(attr, value) {
				let { source, proxy, funcs } = this
				if (typeof value === 'function') {
					funcs[attr] = value.bind(proxy)
				} else if (funcs[attr]) {
					funcs[attr] = false
				}
				if (defaultProps[attr]) {
					source[attr] = value
				} else {
					var oldValue = source[attr]
					source[attr] = value
					this.__write(attr, value, oldValue)
				}
			},
			doRead(attr) {
				let { source, proxy, funcs } = this
				return funcs[attr] || source[attr]
			}
		}
	}
}
