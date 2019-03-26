/**
 * Observe implementation on the VBScript of MSIE
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Mar 19 2019 14:12:23 GMT+0800 (China Standard Time)
 * @modified Tue Mar 26 2019 19:52:26 GMT+0800 (China Standard Time)
 */
import { GLOBAL, CONSTRUCTOR, HAS_OWN_PROP } from '../utility/consts'
import { create, isFn, getDefaultKeys, addDefaultKeys } from '../utility'
import { ObserverTarget, IWatcher, ObservePolicy, IObserver, ARRAY_CHANGE } from './IObserver'

declare function execScript(code: string, type: string): void
declare function parseVB(code: string): void

export default function(): ObservePolicy {
	if (GLOBAL.VBArray) {
		try {
			execScript(['Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function'].join('\n'), 'VBScript')

			addDefaultKeys(VBPROXY_KEY, VBPROXY_CTOR_KEY)

			return {
				__name: 'VBProxy',
				__proxy: 'vb',
				__createProxy<T extends ObserverTarget>(observer: IObserver<T>, target: T, isArray: boolean): T {
					return isArray ? target : new VBProxy(target, observer).__proxy
				},
				__watch<T extends ObserverTarget>(observer: IObserver<T>, prop: string, watcher: IWatcher): Error {
					if (!observer.isArray && !observer.target[VBPROXY_KEY].__props[prop]) {
						return new Error(`property[${prop}] is not defined`)
					}
				}
			}
		} catch (e) {
			console.error(e.message, e)
		}
	}
}

export class VBProxy<T extends {}> {
	private readonly __source: T
	/**
	 * function property map
	 * 	- key: property name
	 * 	- value: [scoped function, original function]
	 */
	private readonly __fns: { [name: string]: [Function, Function] }
	readonly __props: { [prop: string]: boolean }
	private readonly __observer: IObserver<T>
	readonly __proxy: T

	constructor(source: T, observer: IObserver<T>) {
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
		this.__observer = observer
		this.__proxy = proxy
		this.__fns = fns
		this.__props = propMap
		source[VBPROXY_KEY] = this
	}

	private set(prop: string, value: any) {
		const { __source: source, __fns: fns } = this
		if (isFn(value)) {
			fns[prop] = [, value]
		} else if (fns[prop]) {
			fns[prop] = null
		}
		const watcher = this.__observer.watcher(prop)
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

export const VBPROXY_KEY = '__vbclass_binding__',
	VBPROXY_CTOR_KEY = '__vbclass_constructor__',
	OBJECT_DEFAULT_PROPS = [
		VBPROXY_KEY,
		CONSTRUCTOR,
		HAS_OWN_PROP,
		'isPrototypeOf',
		'propertyIsEnumerable',
		'toLocaleString',
		'toString',
		'valueOf'
	]

const CONSTRUCTOR_SCRIPT = `
	Public [${VBPROXY_KEY}]
	Public Default Function [${VBPROXY_CTOR_KEY}](source)
		Set [${VBPROXY_KEY}] = source
		Set [${VBPROXY_CTOR_KEY}] = Me
	End Function
	`,
	classPool = create(null)

function genAccessorScript(prop: string): string {
	return `
	Public Property Let [${prop}](value)
		Call [${VBPROXY_KEY}].set("${prop}", val)
	End Property
	Public Property Set [${prop}](value)
		Call [${VBPROXY_KEY}].set("${prop}", val)
	End Property

	Public Property Get [${prop}]
	On Error Resume Next
		Set [${prop}] = [${VBPROXY_KEY}].get("${prop}")
	If Err.Number <> 0 Then
		[${prop}] = [${VBPROXY_KEY}].get("${prop}")
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
function loadClassFactory(props: string[]): <T extends {}>(source: VBProxy<T>) => T {
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
