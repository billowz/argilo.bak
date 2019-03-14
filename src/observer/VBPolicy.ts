/**
 *
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Thu Mar 14 2019 19:12:03 GMT+0800 (China Standard Time)
 */
import { GLOBAL, CONSTRUCTOR, HAS_OWN_PROP } from '../utility/consts'
import { create, isFn, getDefaultKeys, addDefaultKeys } from '../utility'
import { ObserverTarget, IWatcher, ObserverPolicy, IObserver } from './IObserver'

declare function execScript(code: string, type: string): void
declare function parseVB(code: string): void

export default function(): ObserverPolicy {
	if (GLOBAL.VBArray) {
		try {
			execScript(['Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function'].join('\n'), 'VBScript')
			addDefaultKeys(PROXY_KEY, CONSTRUCTOR_NAME)
			return {
				__name: 'VBProxy',
				__proxy: true,
				__createProxy(
					target: ObserverTarget,
					isArray: boolean,
					watchers: { [prop: string]: IWatcher }
				): ObserverTarget {
					return isArray ? target : new VBProxy(target, watchers).__proxy
				},
				__watch(observer: IObserver, prop: string, watcher: IWatcher): boolean | void {
					//#if _DEBUG
					if (observer.isArray) {
						console.warn(`observing properties on array is not supported.`)
					}
					//#endif
				}
			}
		} catch (e) {
			console.error(e.message, e)
		}
	}
}

export class VBProxy {
	private readonly __source: {}
	/**
	 * function property map
	 * 	- key: property name
	 * 	- value: [scoped function, original function]
	 */
	private readonly __fns: { [name: string]: [Function, Function] }
	readonly __props: { [prop: string]: boolean }
	private readonly __watchers: { [prop: string]: IWatcher }
	readonly __proxy: {}

	constructor(source: {}, watchers: { [prop: string]: IWatcher }) {
		const props = [],
			propMap: { [prop: string]: boolean } = create(null),
			__fns: string[] = [],
			fns: { [prop: string]: [Function, Function] } = create(null)
		let prop: string,
			i = 0,
			j = 0

		for (prop in source) {
			propMap[prop] = true
			props[i++] = prop
			if (isFn(source[prop])) __fns[j++] = prop
		}
		applyProps(props, propMap, OBJECT_DEFAULT_PROPS)
		applyProps(props, propMap, getDefaultKeys())
		const proxy = loadClassFactory(props)(this)

		while (j--) {
			prop = __fns[j]
			fns[prop] = [, source[prop]]
		}

		this.__source = source
		this.__watchers = watchers
		this.__proxy = proxy
		this.__fns = fns
		this.__props = propMap
		source[PROXY_KEY] = this
	}

	private set(prop: string, value: any) {
		const { __source: source, __fns: fns } = this
		if (isFn(value)) {
			fns[prop] = [, value]
		} else if (fns[prop]) {
			fns[prop] = null
		}
		const watcher = this.__watchers[prop]
		watcher && watcher.notify(source[prop])
		source[prop] = value
	}

	private get(prop: string) {
		const fn = this.__fns[prop]
		return fn ? fn[0] || (fn[0] = fn[1].bind(this.__proxy)) : this.__source[prop]
	}
}

function applyProps(props: string[], propMap: { [key: string]: boolean }, applyProps: string[]) {
	let i = applyProps.length,
		j = props.length,
		prop: string
	while (i--) {
		prop = applyProps[i]
		if (!propMap[prop]) {
			propMap[prop] = true
			props[j++] = prop
		}
	}
}

const PROXY_KEY = '__vbclass_binding__',
	CONSTRUCTOR_NAME = '__vbclass_constructor__',
	OBJECT_DEFAULT_PROPS = [
		PROXY_KEY,
		CONSTRUCTOR,
		HAS_OWN_PROP,
		'isPrototypeOf',
		'propertyIsEnumerable',
		'toLocaleString',
		'toString',
		'valueOf'
	],
	CONSTRUCTOR_SCRIPT = `
	Public [${PROXY_KEY}]
	Public Default Function [${CONSTRUCTOR_NAME}](source)
		Set [${PROXY_KEY}] = source
		Set [${CONSTRUCTOR_NAME}] = Me
	End Function
	`,
	classPool = create(null)

function genAccessorScript(prop: string): string {
	return `
	Public Property Let [${prop}](value)
		Call [${PROXY_KEY}].set("${prop}", val)
	End Property
	Public Property Set [${prop}](value)
		Call [${PROXY_KEY}].set("${prop}", val)
	End Property

	Public Property Get [${prop}]
	On Error Resume Next
		Set [${prop}] = [${PROXY_KEY}].get("${prop}")
	If Err.Number <> 0 Then
		[${prop}] = [${PROXY_KEY}].get("${prop}")
	End If
	On Error Goto 0
	End Property

`
}

function genClassScript(className: string, props: string[]): string {
	const buffer = ['Class ', className, CONSTRUCTOR_SCRIPT],
		l = props.length
	let i = 0
	for (; i < l; i++) buffer[i + 3] = genAccessorScript(props[i])
	buffer[i + 3] = 'End Class'
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
