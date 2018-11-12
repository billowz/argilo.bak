/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:33:23
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-06 13:59:32
 */
import { assert, info } from 'devlevel'
import { List, FnList, nextTick, parsePath, formatPath, get, set } from '../common'
import { DEFAULT_BINDING } from '../common/List'
import { DEFAULT_FN_BINDING, DEFAULT_SCOPE_BINDING } from '../common/FnList'
import { inherit, create, extend, apply, defPropValue, hasOwnProp, eq, isPrimitive, isArray, makeMap, makeArray } from '../helper'
import es6 from './es6'
import es5 from './es5'
import vb from './vb'
import { PROTOTYPE } from '../helper/constants'

const OBSERVER_KEY = '__observer__'

// ================= Array Hook Begin =======================
const ARRAY_EVENTS = makeMap('length,change')
const ArrayProto = Array[PROTOTYPE]
const arrayHooks = makeArray('fill,pop,push,reverse,shift,sort,splice,unshift', method => {
		const fn = ArrayProto[method]
		return [
			method,
			function() {
				const len = this.length,
					rs = apply(fn, this, arguments),
					newlen = this.length,
					observer = this[OBSERVER_KEY]
				observer.__write('change', this, this)
				if (len !== newlen) observer.__write('length', newlen, len)
				return rs
			},
		]
	}),
	arrayHookLength = arrayHooks.length

function hookArray(array) {
	for (let i = 0, hook; i < arrayHookLength; i++) {
		hook = arrayHooks[i]
		array[hook[0]] = hook[1]
	}
	return array
}
// ================= Array Hook End =======================

export const defaultProps = makeMap([OBSERVER_KEY, DEFAULT_BINDING, DEFAULT_FN_BINDING, DEFAULT_SCOPE_BINDING])
// ================ init policy Begin ========================
const policy = es6(defaultProps) || es5(defaultProps) || vb(defaultProps)

assert(policy, 'Observer is not supported.')

const { proxyEnabled = false, proxyChangeable = false, sourceOwnProperty = false } = policy

info(
	`Observer: enable policy[${policy.name}]: `,
	{
		proxyEnabled,
		proxyChangeable,
		sourceOwnProperty,
	},
	'default properties: ',
	defaultProps
)

export function isDefaultProp(prop) {
	return defaultProps[prop] || false
}

// ================ init policy End========================

function noProxyChangeEventHandler() {
	return false
}
let disableWriteEvent = false

function Observer(source) {
	// bind observer to object
	defPropValue(source, OBSERVER_KEY, this)
	this.source = this.proxy = source
	this.bubbles = create(null)
	if ((this.isArray = isArray(source))) {
		hookArray(source)
	} else {
		this.__init()
	}
}

inherit(
	Observer,
	{
		__init() {
			// implement by policy
		},
		__watch(prop) {
			// implement by policy
		},
		__write(prop, value, oldValue) {
			// call by policy
			if (disableWriteEvent) return
			const list = this.bubbles[prop]
			if (!list || !list.length || (value === oldValue && isPrimitive(value))) return
			list.each(desc => addChangedQueue(desc, oldValue))
		},
		observe(path, handler, scope) {
			assert.fn(handler, 'require function handler.')

			path = parsePath(path)
			const l = path.length - 1
			assert(l >= 0, 'require non-empty path.')

			let watchs = this.watchs || (this.watchs = create(null)),
				currentObserver = this,
				attr,
				desc,
				parent = undefined,
				i = 0,
				childObserver,
				obj

			for (; i <= l; i++) {
				attr = path[i]
				desc = watchs[attr]
				if (!desc) {
					desc = allocWatchDescriptor(this, currentObserver, attr, parent)
					if (currentObserver) {
						assert(!currentObserver.isArray || (ARRAY_EVENTS[attr] && i == l), () => {
							const pathStr = formatPath(path)
							const errorPath = formatPath(path.slice(i))
							const arrayPath = i ? '[' + formatPath(path.slice(0, i)) + ']' : ''
							return `invalid path[${pathStr}]: not support "${errorPath}" in Array${arrayPath}, change to "change" or "length".`
						})

						registerBubble(currentObserver, desc)
					}
				}
				if (i < l) {
					parent = desc
					watchs = desc[DESC_CHILDREN_INDEX]
					if (currentObserver) {
						if ((obj = currentObserver.source[attr])) {
							if (!(childObserver = getObserver(obj))) {
								childObserver = new Observer(obj)
								setChildObserver(currentObserver, attr, childObserver)
							}
						} else {
							childObserver = undefined
						}
						currentObserver = childObserver
					}
				}
			}
			desc[DESC_PATH_INDEX] = path
			return desc[DESC_HANDLERS_INDEX].add(handler, scope)
		},
		unobserve(path, handler, scope) {
			assert.fn(handler, 'require function handler.')

			path = parsePath(path)
			const l = path.length

			assert(l, 'require non-empty path.')

			return this.watchs ? unwatch(this.watchs, path, 0, l - 1, handler, scope) : false
		},
		isObserved(path, handler, scope) {
			assert.fn(handler, 'require function handler.')

			path = parsePath(path)
			const l = path.length - 1

			assert(l >= 0, 'require non-empty path.')

			let watchs = this.watchs,
				i = 0,
				desc

			if (!watchs) return false

			for (; i <= l; i++) {
				desc = watchs[path[i]]
				if (!desc) return false
				if (i < l) watchs = desc[DESC_CHILDREN_INDEX]
			}
			return handler ? desc[DESC_HANDLERS_INDEX].has(handler, scope) : !!desc[DESC_HANDLERS_INDEX].size()
		},
		set: proxyEnabled
			? function(path, value, disableEvent) {
					_set(this, parsePath(path), value, disableEvent)
					return this
			  }
			: function(path, value, disableEvent) {
					if (disableEvent) {
						const disabled = disableWriteEvent
						disableWriteEvent = true
						_set(this, path, value, true)
						disableWriteEvent = disabled
					} else {
						_set(this, path, value, true)
					}
					return this
			  },
		get(path) {
			return get(this.source, path)
		},
		__proxyChanged: noProxyChangeEventHandler,
		onProxyChange: noProxyChangeEventHandler,
		unProxyChange: noProxyChangeEventHandler,
	},
	policy.impl
)

// ============ watch descriptor begin ===============
const DESC_HANDLERS_INDEX = 0,
	DESC_CHILDREN_INDEX = 1,
	DESC_CHILD_NUM_INDEX = 2,
	DESC_OWNER_INDEX = 3,
	DESC_OBSERVER_INDEX = 4,
	DESC_ATTR_INDEX = 5,
	DESC_PARENT_INDEX = 6,
	DESC_CHANGED_INDEX = 7,
	DESC_EVENT_INDEX = 8,
	DESC_VALUE_INDEX = 9,
	DESC_PATH_INDEX = 10

function allocWatchDescriptor(owner, observer, attr, parent) {
	const desc = [new FnList(), create(null), 0, owner, observer, attr, parent, NO_CHANGED, NO_CHANGED]
	if (parent) {
		parent[DESC_CHILDREN_INDEX][attr] = desc
		parent[DESC_CHILD_NUM_INDEX]++
	} else {
		owner.watchs[attr] = desc
	}
	return desc
}

function freeWatchDescriptor(desc) {
	const parent = desc[DESC_PARENT_INDEX],
		attr = desc[DESC_ATTR_INDEX]
	if (parent) {
		parent[DESC_CHILDREN_INDEX][attr] = undefined
		parent[DESC_CHILD_NUM_INDEX]--
	} else {
		desc[DESC_OWNER_INDEX].watchs[attr] = undefined
	}
}
// ============ watch descriptor end ===============

function unwatch(watchs, path, level, maxLevel, handler, scope) {
	const desc = watchs[path[level]]
	if (desc) {
		const ret = level === maxLevel ? desc[DESC_HANDLERS_INDEX].remove(handler, scope) : unwatch(desc[DESC_CHILDREN_INDEX], path, level + 1, maxLevel, handler, scope)

		if (!desc[DESC_CHILD_NUM_INDEX] && !desc[DESC_HANDLERS_INDEX].size()) {
			unregisterBubble(desc[DESC_OBSERVER_INDEX], desc, desc[DESC_ATTR_INDEX])
			freeWatchDescriptor(desc)
		}
		return ret
	}
	return false
}

function registerBubble(observer, descriptor) {
	if (!observer) return false
	let bubbles = observer.bubbles,
		attr = descriptor[DESC_ATTR_INDEX],
		descs = bubbles[attr]

	if (!descs) {
		descs = bubbles[attr] = new List()
		if (!observer.isArray) observer.__watch(attr)
	}
	return descs.add(descriptor)
}

function unregisterBubble(observer, descriptor, attr) {
	if (!observer) return false
	const bubbles = observer.bubbles,
		descs = bubbles[attr]
	return descs && descs.remove(descriptor)
}

const changedQueue = [],
	eventQueue = [],
	NO_CHANGED = {}

function addChangedQueue(desc, oldValue) {
	if (desc[DESC_CHANGED_INDEX] === NO_CHANGED) {
		desc[DESC_CHANGED_INDEX] = oldValue
		const l = changedQueue.length
		changedQueue[l] = desc
		if (!l) nextTick(flushChangedQueue)
	}
}

function addEventQueue(desc, value, oldValue) {
	if (desc[DESC_EVENT_INDEX] === NO_CHANGED) {
		desc[DESC_VALUE_INDEX] = value
		desc[DESC_EVENT_INDEX] = oldValue
		eventQueue.push(desc)
	} else {
		desc[DESC_VALUE_INDEX] = value
	}
}

function flushChangedQueue() {
	let desc,
		i = 0,
		l = changedQueue.length

	for (; i < l; i++) {
		desc = changedQueue[i]
		bubble(desc, observerValue(desc[DESC_OBSERVER_INDEX], desc[DESC_ATTR_INDEX]), desc[DESC_CHANGED_INDEX], addEventQueue)
		desc[DESC_CHANGED_INDEX] = NO_CHANGED
	}
	changedQueue.length = 0

	let value, oldValue
	for (i = 0, l = eventQueue.length; i < l; i++) {
		desc = eventQueue[i]
		value = desc[DESC_VALUE_INDEX]
		oldValue = desc[DESC_EVENT_INDEX]
		if (value !== oldValue || !isPrimitive(value))
			desc[DESC_HANDLERS_INDEX].each((callback, scope) => {
				scope ? callback.call(scope, desc[DESC_PATH_INDEX], value, oldValue, desc[DESC_OWNER_INDEX]) : callback(desc[DESC_PATH_INDEX], value, oldValue, desc[DESC_OWNER_INDEX])
			})
		desc[DESC_EVENT_INDEX] = NO_CHANGED
	}
	eventQueue.length = 0
}

function bubble(desc, value, oldValue, cb) {
	if (desc[DESC_HANDLERS_INDEX].size()) cb(desc, value, oldValue)

	if (desc[DESC_CHILD_NUM_INDEX]) {
		newObserver = value ? observer(value) : undefined
		setChildObserver(desc[DESC_OBSERVER_INDEX], desc[DESC_ATTR_INDEX], newObserver)
		__bubble(desc, newObserver, cb)
	}
}

function __bubble(parent, newObserver, cb) {
	let children = parent[DESC_CHILDREN_INDEX],
		attr,
		desc,
		oldObserver,
		nextObserver

	for (attr in children) {
		if ((desc = children[attr]) && desc[DESC_OWNER_INDEX] && (oldObserver = desc[DESC_OBSERVER_INDEX]) !== newObserver) {
			if (desc[DESC_HANDLERS_INDEX].size()) cb(desc, observerValue(newObserver, attr), observerValue(oldObserver, attr))

			unregisterBubble(oldObserver, desc, attr)
			desc[DESC_OBSERVER_INDEX] = newObserver
			registerBubble(newObserver, desc)

			if (desc[DESC_CHILD_NUM_INDEX]) {
				nextObserver = (nextObserver = newObserver.source[attr]) ? observer(nextObserver) : undefined
				setChildObserver(newObserver, attr, nextObserver)
				__bubble(desc, nextObserver, cb)
			}
		}
	}
}

const setChildObserver = proxyEnabled
	? function(parentObserver, attr, childObserver) {
			if (childObserver) parentObserver.source[attr] = childObserver.proxy
	  }
	: function(parentObserver, attr, childObserver) {}

function observerValue(observer, attr) {
	if (observer) {
		if (observer.isArray && attr === 'change') return observer.proxy
		return observer.source[attr]
	}
}

function _set(observer, path, value, setSource) {
	let i = 0,
		l = path.length - 1,
		prop,
		obj,
		nextObj,
		source

	for (; i < l; i++) {
		prop = path[i]
		if (observer) {
			source = observer.source
			nextObj = source[prop]
			if (!nextObj || !(observer = getObserver(nextObj))) {
				if (nextObj === undefined || nextObj === null) nextObj = setSource ? (source[prop] = {}) : (observer.proxy[prop] = {})
				observer = undefined
				obj = nextObj
			}
		} else {
			nextObj = obj[prop]
			if (!nextObj) nextObj = obj[prop] = {}
			obj = nextObj
		}
	}
	prop = path[i]
	if (observer) {
		setSource ? (observer.source[prop] = value) : (observer.proxy[prop] = value)
	} else {
		obj[prop] = value
	}
}

// ================== API ============================
export function isProxyEnabled() {
	return proxyEnabled
}

export function $set(obj, path, value) {
	path = parsePath(path)
	const observer = getObserver(obj)
	if (observer) return _set(observer, path, value, !proxyEnabled)
	set(obj, path)
}

export function observer(source) {
	return getObserver(source) || new Observer(source)
}

export function observe(source, path, handler, scope) {
	const _observer = observer(source)
	return _observer.observe(path, handler, scope), _observer.proxy
}

export function unobserve(obj, path, handler, scope) {
	const observer = getObserver(obj)
	return observer ? (observer.unobserve(path, handler, scope), observer.proxy) : obj
}

export function isObserved(obj, path, handler, scope) {
	const observer = getObserver(obj)
	return observer && observer.isObserved(path, handler, scope)
}

let getObserver = obj => {
		const observer = obj[OBSERVER_KEY]
		if (observer && observer.source === obj) return observer
	},
	$hasOwnProp = (obj, prop) => {
		return defaultProps[prop] ? false : hasOwnProp(obj, prop)
	},
	source = obj => obj,
	proxy = source,
	$eq = eq,
	onProxyChange = noProxyChangeEventHandler,
	unProxyChange = noProxyChangeEventHandler

if (proxyEnabled) {
	if (sourceOwnProperty) {
		$hasOwnProp = function(obj, prop) {
			if (defaultProps[prop]) return false
			const observer = getObserver(obj)
			return hasOwnProp(observer ? observer.source : obj, prop)
		}
	}

	$hasOwnProp = function(obj, prop) {
		if (defaultProps[prop]) return false
		const observer = getObserver(obj)
		return hasOwnProp(observer ? observer.source : obj, prop)
	}

	getObserver = function(obj) {
		const observer = obj[OBSERVER_KEY]
		if (observer && (observer.source === obj || observer.proxy === obj)) return observer
	}
	source = function(obj) {
		const observer = obj && getObserver(obj)
		return observer ? observer.source : obj
	}
	proxy = function(obj) {
		const observer = obj && getObserver(obj)
		return observer ? observer.proxy : obj
	}
	$eq = function(o1, o2) {
		return eq(o1, o2) || (o1 && o2 && (o1 = getObserver(o1)) ? o1 === getObserver(o2) : false)
	}
	if (proxyChangeable) {
		extend(Observer, {
			__proxyChanged() {
				const list = this.proxyListens,
					source = this.source,
					proxy = this.proxy
				list &&
					list.each((callback, scope) => {
						scope ? callback.call(scope, source, proxy, this) : callback(source, proxy, this)
					})
			},
			onProxyChange(fn, scope) {
				assert.fn(fn, 'require function handler.')
				let list = this.proxyListens
				if (!list) list = this.proxyListens = new FnList()
				return list.add(fn, scope)
			},
			unProxyChange(fn, scope) {
				assert.fn(fn, 'require function handler.')
				let list = this.proxyListens
				return list && list.remove(fn, scope)
			},
		})

		onProxyChange = function(obj, fn, scope) {
			const observer = getObserver(obj)
			return observer && observer.onProxyChange(fn, scope)
		}
		unProxyChange = function(obj, fn, scope) {
			const observer = getObserver(obj)
			return observer && observer.unProxyChange(fn, scope)
		}
	}
}

export { getObserver, $hasOwnProp, source, proxy, $eq, onProxyChange, unProxyChange }

export function $getOwnProp(obj, key, defaultVal) {
	return $hasOwnProp(obj, key) ? obj[key] : defaultVal
}
