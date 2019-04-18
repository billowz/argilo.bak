/**
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Apr 04 2019 20:42:20 GMT+0800 (China Standard Time)
 * @modified Mon Apr 15 2019 16:30:29 GMT+0800 (China Standard Time)
 */

import { ARRAY_LENGTH, ARRAY_CHANGE, IObserver, OBSERVER_KEY } from './IObserver'
import { eachObj, eachArray, isFn, applyScope, defValue, SKIP } from '../util'
import { P_PROTOTYPE } from '../util/consts'

type ArrayHook = [string, (...args: any[]) => any]
const arrayHooks = []
const ARRAY_LEN_CHANGE = [ARRAY_LENGTH, ARRAY_CHANGE]
const arrayHookCfg: {
	[methods: string]: [string[]?, { [prop: string]: any }?] | ((ob: IObserver<any[]>, args: IArguments) => void)
} = {
	push: [ARRAY_LEN_CHANGE],
	pop: [ARRAY_LEN_CHANGE],
	splice(ob: IObserver<any[]>, args: IArguments) {
		const { target, proxy } = ob
		const start = args[0],
			d = args.length - 2 - args[1],
			end = start + args[1]
		ob.notifies(null, prop =>
			prop === ARRAY_CHANGE
				? proxy
				: prop === ARRAY_LENGTH
				? d
					? target[prop]
					: SKIP
				: prop >= start && (d || prop < end)
				? target[prop]
				: SKIP
		)
	},
	copyWithin(ob: IObserver<any[]>, args: IArguments) {
		const { target, proxy } = ob
		const start = args[1],
			end = args[2]
		ob.notifies(null, prop =>
			prop === ARRAY_CHANGE ? proxy : prop !== ARRAY_LENGTH && (prop >= start && prop < end) ? target[prop] : SKIP
		)
	},
	shift: [],
	unshift: [],
	'fill,reverse,sort': [null, { length: 1 }]
}
eachObj(arrayHookCfg, (hooker, methods) => {
	eachArray(methods.split(','), method => {
		const fn = Array[P_PROTOTYPE][method]
		let hook: (...args: any[]) => any
		if (isFn(hooker)) {
			const cb: (ob: IObserver<any[]>, args: IArguments) => void = hooker as ((ob: IObserver<any[]>) => void)
			hook = function() {
				const ob: IObserver<any[]> = this[OBSERVER_KEY]
				cb(ob, arguments)
				return applyScope(fn, ob.target, arguments)
			}
		} else {
			const [props, execludes] = hooker as [string[]?, { [prop: string]: any }?]
			hook = function() {
				const ob: IObserver<any[]> = this[OBSERVER_KEY]
				ob.notifies(props, getArrayOriginValue, execludes)
				return applyScope(fn, ob.target, arguments)
			}
		}
		arrayHooks.push([method, hook])
	})
})

function getArrayOriginValue(prop: string, ob: IObserver<any[]>) {
	return prop === ARRAY_CHANGE ? ob.proxy : ob.target[prop]
}

/**
 * apply observer hooks on Array
 * @param array
 */
export function applyArrayHooks(array: any[]) {
	let hook: ArrayHook,
		i = arrayHooks.length
	while (i--) {
		hook = arrayHooks[i]
		defValue(array, hook[0], hook[1], false, false, false)
	}
}
