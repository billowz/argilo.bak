/**
 *
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Thu Jan 03 2019 15:17:36 GMT+0800 (China Standard Time)
 */
import { assert } from '../utility/assert'
import { Proxy, ProxyGetter, ProxySetter } from './Proxy'
import { GLOBAL, CONSTRUCTOR, HAS_OWN_PROP } from '../utility/consts'
import { create, isFn } from '../utility'

declare function execScript(code: string, type: string): void
declare function parseVB(code: string): void

export class VBProxy extends Proxy {
	static init() {
		execScript(
			`
Function parseVB(code)
	ExecuteGlobal(code)
End Function`,
			'VBScript'
		)
	}
	private readonly source: {}
	private readonly values: {}
	private __proxy: {}
	private __fns: { [name: string]: Function }
	constructor(source: {}) {
		super()
	}

	private buildProxy() {
		let source = this.source,
			proxy = (this.__proxy = createProxy(source, this)),
			funcs = (this.__fns = create(null)),
			fn: any
		for (var prop in source) {
			if (isFn((fn = source[prop]))) funcs[prop] = fn.bind(proxy)
		}
	}
	private __set(prop: string, value: any) {
		let { source, __fns: fns } = this
		if (isFn(value)) {
			fns[prop] = value.bind(this.__proxy)
		} else if (fns[prop]) {
			fns[prop] = null
		}
		const accessor = this.__accessors[prop]
		return accessor && accessor[1] ? accessor[1](source, prop, value) : (source[prop] = value)
	}
	private __get(prop: string) {
		let { source, __fns: fns } = this
		return fns[prop] || source[prop]
	}
}

const OBJECT_DEFAULT_PROPS = [
		CONSTRUCTOR,
		HAS_OWN_PROP,
		'isPrototypeOf',
		'propertyIsEnumerable',
		'toLocaleString',
		'toString',
		'valueOf'
	],
	SOURCE_KEY = '__vbclass_binding__',
	CONSTRUCTOR_NAME = '__vbclass_constructor__',
	CONSTRUCTOR_SCRIPT = `
	Public [${SOURCE_KEY}]
	Public Default Function [${CONSTRUCTOR_NAME}](source)
		Set [${SOURCE_KEY}] = source
		Set [${CONSTRUCTOR_NAME}] = Me
	End Function
	`,
	classPool = create(null)

function genAccessorScript(prop: string) {
	return `
	Public Property Let [${prop}](value)
		Call [${SOURCE_KEY}].__set("${prop}", val)
	End Property
	Public Property Set [${prop}](value)
		Call [${SOURCE_KEY}].__set("${prop}", val)
	End Property

	Public Property Get [${prop}]
	On Error Resume Next
		Set [${prop}] = [${SOURCE_KEY}].__get("${prop}")
	If Err.Number <> 0 Then
		[${prop}] = [${SOURCE_KEY}].__get("${prop}")
	End If
	On Error Goto 0
	End Property

`
}

function genClassScript(className: string, props: string[]) {
	let buffer = [`Class ${className}`, CONSTRUCTOR_SCRIPT],
		i = props.length

	while (i--) buffer.push(genAccessorScript(props[i]))

	buffer.push('End Class')
	return buffer.join('\n')
}

let classNameGenerator = 1
function loadClassFactory(props: string[]): (source: VBProxy) => {} {
	const classKey = props.sort().join('|')
	let factoryName = classPool[classKey]
	if (!factoryName) {
		const className = `VBClass${classNameGenerator++}`
		factoryName = `${className}Factory`

		// build VB Class
		parseVB(genClassScript(className, props))

		parseVB(`
Function ${factoryName}(desc)
	Dim o
	Set o=(New ${className})(desc)
	Set ${factoryName} = o
End Function`)

		classPool[classKey] = factoryName
	}
	return GLOBAL[factoryName]
}

function createProxy(source: {}, vbproxy: VBProxy) {
	const propMap = create(null),
		props = []
	let prop: string,
		i = 0

	for (var l = OBJECT_DEFAULT_PROPS.length; i < l; i++) {
		prop = OBJECT_DEFAULT_PROPS[i]
		propMap[prop] = true
		props[i] = prop
	}

	for (prop in source) {
		if (!propMap[prop]) {
			props[i++] = prop
			propMap[prop] = true
		}
	}

	/* for (prop in defaultPropMap) {
		if (defaultPropMap[prop] && !propMap[prop]) {
			source[prop] = undefined
			propMap[prop] = true
			props.push(prop)
		}
	} */
	return loadClassFactory(props)(vbproxy)
}
