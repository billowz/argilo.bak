/**
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Dec 26 2018 13:59:10 GMT+0800 (China Standard Time)
 * @modified Thu Dec 27 2018 10:01:36 GMT+0800 (China Standard Time)
 */
import {
	defPropValue,
	create,
	makeMap,
	mapArray,
	applyScope,
	parsePath,
	FnList,
	formatPath,
	List,
	nextTick
} from '../utility'
import { isArray, isPrimitive } from 'util'
import { PROTOTYPE } from '../utility/consts'
import { assert } from '../utility/assert'

export type ObserverTarget = any[] | {}

export type ObserveCallback = (path: string[], value: any, original: any, observer: Observer) => void

//========================================================================================
/*                                                                                      *
 *                                        watcher                                       *
 *                                                                                      */
//========================================================================================

const UNCHANGE_VALUE = new String('unchange')
class Watcher {
	readonly owner: Observer // owner observer
	path: string[] // watch path
	cbs: FnList<ObserveCallback> // user callbacks
	subs: Watchers // sub watchers
	original: any // original value
	value: any // new value
	readonly watchers: Watchers // owner.watchers or parent watcher.watchers
	observer: Observer // watch observer
	readonly prop: string // watch property on observer
	constructor(owner: Observer, prop: string, watchers: Watchers) {
		this.owner = owner
		this.prop = prop
		this.watchers = watchers
		this.original = UNCHANGE_VALUE
		watchers[prop] = this
	}
	addCB(path: string[], cb: ObserveCallback, scope: any) {
		return (this.cbs || ((this.path = path), (this.cbs = new FnList<ObserveCallback>()))).add(cb)
	}
	getSubs() {
		return this.subs || (this.subs = create(null))
	}
}

type Watchers = {
	[prop: string]: Watcher
}

const changedQueue = [],
	eventQueue = [],
	NO_CHANGED = {}

const OBSERVER_KEY = '__observer__'
let writeEventEnabled = true

export class Observer {
	readonly target: ObserverTarget

	readonly isArray: boolean

	proxy: ObserverTarget

	private __bubbles: { [prop: string]: List<Watcher> }
	private __watchers: Watchers

	constructor(target: ObserverTarget) {
		this.target = target
		this.proxy = target
		this.__bubbles = create(null)
		if ((this.isArray = isArray(target))) hookArray(target as any[])
		defPropValue(target, OBSERVER_KEY, this, false, false, false)
	}

	observe(propPath: string | string[], callback: ObserveCallback, scope?: any) {
		const path: string[] = parsePath(propPath)

		let watchers: Watchers = this.__watchers || (this.__watchers = create(null)),
			observer: Observer = this,
			prop: string,
			watcher: Watcher,
			target: ObserverTarget,
			value: ObserverTarget,
			i = 0,
			l = path.length - 1

		// get or create Watcher on path
		for (; i <= l; i++) {
			prop = path[i]
			if (!(watcher = watchers[prop])) {
				if (observer && observer.isArray && (!ARRAY_EVENTS[prop] || i !== l))
					assert(
						`invalid path[{}]: not support {} on Array{}, change to "change" or "length".`,
						formatPath(path),
						formatPath(path.slice(i)),
						i ? '[' + formatPath(path.slice(0, i)) + ']' : ''
					)
				watcher = this.__addWatcher(observer, prop, watchers)
			} else if (observer && watcher.observer !== observer) {
				observer.__addBubble(watcher)
			}
			if (i !== l) {
				watchers = watcher.subs
				if (observer) {
					target = observer.target
					if ((value = target[prop])) {
						// TODO get exist observer
						observer = value[OBSERVER_KEY] || new Observer(value)
						// update proxy
						observer.proxy !== value && (target[prop] = observer.proxy)
					} else {
						observer = null
					}
				}
			}
		}
		!watcher.path && (watcher.path = path)
		return watcher.cbs.add(callback, scope)
	}

	unobserve(propPath: string | string[], handler: ObserveCallback, scope?: any) {
		const path = parsePath(propPath)
		let watchers: Watchers = this.__watchers,
			prop: string,
			watcher: Watcher,
			i = 0,
			l = path.length - 1
		for (; i <= l && watchers; i++) {
			watcher = watchers[prop]
			watchers = watcher.subs
		}
	}

	protected _write(prop: string, originValue: any, value: any) {
		if (writeEventEnabled) {
			const watchers = this.__bubbles[prop]
			if (watchers && watchers.size() && (originValue !== value || !isPrimitive(value))) {
				watchers.each(watcher => {
					watcher.original === NO_CHANGED && (watcher.original = originValue)
					watcher.value = value
					const l = changedQueue.length
					changedQueue[l] = watcher
					if (!l) nextTick(flushChangedQueue)
				})
			}
		}
	}

	protected _watch(prop: string) {
		assert()
	}

	private __addWatcher(observer: Observer, prop: string, watchers: Watchers): Watcher {
		const watcher: Watcher = {
			prop,
			watchers,
			owner: this,
			cbs: new FnList<ObserveCallback>(),
			flags: 0
		}
		watchers[prop] = watcher
		observer && observer.__addBubble(watcher)
		return watcher
	}

	private __addBubble(watcher: Watcher) {
		const { prop } = watcher
		const { __bubbles: bubbles } = this
		let watchers = bubbles[prop]
		if (!watchers) {
			bubbles[prop] = watchers = new List()
			if (!this.isArray) this._watch(prop)
		}
		watcher.observer = this
		watchers.add(watcher)
	}

	private __delBubble(watcher: Watcher) {
		this.__bubbles[watcher.prop].remove(watcher)
	}
}

//========================================================================================
/*                                                                                      *
 *                                  Hook Array Methods                                  *
 *                                                                                      */
//========================================================================================

type ArrayHooker = [string, (...args: any[]) => any]
const ARRAY_EVENTS = makeMap('length,change', 1),
	ArrayProto = Array[PROTOTYPE],
	arrayHooks: ArrayHooker[] = mapArray(
		'fill,pop,push,reverse,shift,sort,splice,unshift'.split(','),
		(method: string): ArrayHooker => {
			const fn = ArrayProto[method]
			return [
				method,
				function() {
					const array: any[] = this,
						len = array.length,
						rs: any = applyScope(fn, array, arguments),
						newlen = array.length,
						observer: Observer = array[OBSERVER_KEY]
					observer._write('change', array, array)
					if (len !== newlen) observer._write('length', newlen, len)
					return rs
				}
			]
		}
	),
	arrayHookLength = arrayHooks.length

function hookArray(array: any[]) {
	for (let i = 0, hook: ArrayHooker; i < arrayHookLength; i++) {
		hook = arrayHooks[i]
		array[hook[0]] = hook[1]
	}
}
