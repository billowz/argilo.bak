import { makeMap, mapArray, applyScope, defPropValue, create, isArray, FnList, List } from '../utility'
import { PROTOTYPE } from '../utility/consts'

/**
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Dec 26 2018 13:59:10 GMT+0800 (China Standard Time)
 * @modified Fri Dec 28 2018 11:51:34 GMT+0800 (China Standard Time)
 */
export type ObserverTarget = any[] | {}

export type ObserveCallback = (path: string[], value: any, original: any, observer: Observer) => void

class Subject {
	readonly owner: Observer
	readonly path: string[]
	readonly cbs: FnList<ObserveCallback>
	original: any
	value: any
	constructor(owner: Observer, path: string[]) {
		this.path = path
		this.owner = owner
		this.cbs = new FnList<ObserveCallback>()
	}
	listen(cb: ObserveCallback, scope: any) {
		return this.cbs.add(cb, scope)
	}
	unlisten(cb: ObserveCallback, scope: any) {
		return this.cbs.remove(cb, scope)
	}
}

let watcherIdGenerator = 1
class Watcher {
	readonly id:string
	readonly owner: Observer
	readonly prop: string
	constructor(owner: Observer,prop: string){
		this.prop = prop
		this.owner = owner
		this.id = `$${watcherIdGenerator++}`
	}
}

const OBSERVER_KEY = '__observer__'
export class Observer {
	readonly target: ObserverTarget

	readonly isArray: boolean

	proxy: ObserverTarget

	constructor(target: ObserverTarget) {
		this.target = target
		if ((this.isArray = isArray(target))) applyArrayHooks(target as any[])
		defPropValue(target, OBSERVER_KEY, this, false, false, false)
	}
}

//========================================================================================
/*                                                                                      *
 *                                  Hook Array Methods                                  *
 *                                                                                      */
//========================================================================================

type ArrayHook = [string, (...args: any[]) => any]
const ARRAY_EVENTS = makeMap('length,change', 1),
	arrayHooks = mapArray(
		'fill,pop,push,reverse,shift,sort,splice,unshift'.split(','),
		(method: string): ArrayHook => {
			const fn = Array[PROTOTYPE][method]
			return [
				method,
				function() {
					const array: any[] = this,
						len = array.length,
						rs: any = applyScope(fn, array, arguments),
						newlen = array.length,
						observer: any = array[OBSERVER_KEY]
					observer._write('change', array, array)
					if (len !== newlen) observer._write('length', newlen, len)
					return rs
				}
			]
		}
	)
function applyArrayHooks(array: any[]) {
	let hook: ArrayHook,
		i = arrayHooks.length
	while (i--) {
		hook = arrayHooks[i]
		defPropValue(array, hook[0], hook[1], false, false, false)
	}
}
