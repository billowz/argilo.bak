/**
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Dec 26 2018 13:59:10 GMT+0800 (China Standard Time)
 * @modified Fri Mar 22 2019 19:49:34 GMT+0800 (China Standard Time)
 */

import {
	mapArray,
	applyScope,
	defPropValue,
	create,
	isArray,
	FnList,
	List,
	parsePath,
	formatPath,
	isObj,
	isPrimitive,
	nextTick,
	isNil,
	toStrType,
	get,
	eq,
	set
} from '../utility'
import { PROTOTYPE } from '../utility/consts'
import { assert } from '../utility/assert'
import { ObserverTarget, IWatcher, OBSERVER_KEY, IObserver, ObserverPolicy, ARRAY_CHANGE } from './IObserver'
import accessorPolicy from './accessorPolicy'
import proxyPolicy from './proxyPolicy'

/**
 * change callback for observer
 * @param path 		the observe path
 * @param value 	new value
 * @param original	original value. the original value is {@link MISS} when the dirty collector loses the original value
 */
export type ObserverCallback = (path: string[], value: any, original: any, observer: Observer) => void

/**
 * The dirty collector lost the original value
 */
export const MISS = {}

//========================================================================================
/*                                                                                      *
 *                                        topic                                         *
 *                                                                                      */
//========================================================================================

/**
 * special object
 * - special object indicates that the topic has not changed
 */
const V = {}

function isObserverTarget(obj: any) {
	return obj && (isArray(obj) || isObj(obj))
}

/**
 * is array change property
 * @param observer 	observer
 * @param prop 		property of the observer's target
 */
function isArrayChangeProp(observer: Observer, prop: string) {
	return observer.isArray && prop === ARRAY_CHANGE
}

/**
 * get property value on object
 * @param obj 	object
 * @param prop 	property
 */
function getValue(obj: any, prop: string) {
	return obj === undefined || obj === null ? undefined : obj[prop]
}

/**
 * get property value on the original value
 * check {@link MISS}
 * @param original 	original value
 * @param prop 		property
 */
function getOriginalValue(original: any, prop: string) {
	return original === undefined || original === null ? undefined : original === MISS ? original : original[prop]
}

// id generator of topic
let topicIdGen = 0

// the dirty topic queue waiting for collection
const collectQueue: Topic[] = []

// the dirty topic queue waiting for notification
const dirtyQueue: Topic[] = []

// flags of topic
const TOPIC_ENABLED_FLAG = 0x1, // topic is enabled
	TOPIC_LISTEN_FLAG = 0x2, // topic is listend
	TOPIC_SUB_FLAG = 0x4 // topic has subtopic

/**
 * @ignore
 */
class Topic {
	readonly __id: number

	// parent topic
	readonly __parent: Topic

	// own observer
	readonly __owner: Observer

	// watch property
	readonly __prop: string

	// binded observer
	__observer: Observer

	// property path
	__path: string[]

	// listeners
	__listeners: FnList<ObserverCallback>

	// the original value before change
	__original: any

	// collected dirty value: [new value, original value, force notify]
	__dirty: [any, any, boolean]

	// subtopics
	__subs: Topic[]

	// cache of subtopics
	__subCache: { [key: string]: Topic }

	// flags: TOPIC_ENABLED_FLAG | TOPIC_LISTEN_FLAG | TOPIC_SUB_FLAG
	__state: number

	/**
	 * create a Topic
	 * @param owner		own observer
	 * @param prop		watch property
	 * @param parent	parent topic
	 */
	constructor(owner: Observer, prop: string, parent?: Topic) {
		this.__state = 0
		this.__original = V // special object indicates that the topic has not changed
		this.__owner = owner
		this.__prop = prop
		this.__parent = parent
		this.__id = topicIdGen++
	}

	/**
	 * add listener
	 * @param path		path of topic
	 * @param cb		observe callback
	 * @param scope		scope of the callback
	 * @return listen-id | undefined
	 */
	__listen(path: string[], cb: ObserverCallback, scope: any) {
		let { __listeners: listeners } = this
		if (!listeners) {
			this.__listeners = listeners = new FnList<ObserverCallback>()
			this.__path = path
		}
		const id = listeners.add(cb, scope)
		id && (this.__state |= TOPIC_LISTEN_FLAG | TOPIC_ENABLED_FLAG)
		return id
	}

	/**
	 * remove listener by callback
	 * @param cb		observe callback
	 * @param scope		scope of the callback
	 */
	__unlisten(cb: ObserverCallback, scope: any) {
		const { __listeners: listeners } = this
		if (listeners) {
			listeners.remove(cb, scope)
			this.____unlisten(listeners)
		}
	}

	/**
	 * remove listener by listen-id
	 * @param id	listen-id
	 */
	__unlistenId(id: string) {
		const { __listeners: listeners } = this
		if (listeners) {
			listeners.removeId(id)
			this.____unlisten(listeners)
		}
	}

	/**
	 * Clear all unlistening leaf topics (!TOPIC_LISTEN_FLAG && !TOPIC_SUB_FLAG)
	 * @param listeners	listeners
	 */
	private ____unlisten(listeners: FnList<ObserverCallback>) {
		if (!listeners.size()) {
			// this topic has no listeners, clear the listen flag
			var topic: Topic = this,
				parent: Topic
			topic.__state &= ~TOPIC_LISTEN_FLAG
			while (topic.__state === TOPIC_ENABLED_FLAG) {
				// the topic has no listeners and subtopics
				//  - unbind the observer on the topic
				//  - clear topic state
				//  - remove from the parent topic
				topic.__bind()
				topic.__state = 0
				if (!(parent = topic.__parent)) break
				parent.__removeSub(topic)
				topic = parent // re-check the parent topic
			}
		}
	}

	/**
	 * bind observer
	 * @param observer new observer
	 */
	__bind(observer?: Observer) {
		const { __observer: org } = this
		if (org !== observer) {
			org && org.__unwatchTopic(this) // unbind old observer
			this.__observer = observer && observer.__watchTopic(this) ? observer : observer
		}
	}

	/**
	 * get a subtopic from the cache
	 * @param prop property
	 */
	__getSub(prop: string): Topic {
		const { __subCache: subCache } = this
		return subCache && subCache[prop]
	}

	/**
	 * get or create a subtopic on the cache
	 * @param subProp	property of the subtopic
	 * @return subtopic
	 */
	__addSub(subProp: string): Topic {
		const subCache: { [key: string]: Topic } =
				this.__subCache || ((this.__subs = []), (this.__subCache = create(null))),
			sub: Topic = subCache[subProp] || (subCache[subProp] = new Topic(this.__owner, subProp, this))

		if (!(sub.__state & TOPIC_ENABLED_FLAG)) {
			// init the subtopic

			const { __subs: subs, __observer: observer } = this

			// 1. bind observer
			if (observer) {
				const { __prop: prop } = this

				//#if _DEBUG
				isArrayChangeProp(observer, prop) && sub.__badPath(2, 'Array')
				//#endif

				var subObserver: Observer
				if (subs[0]) {
					subObserver = subs[0].__observer
				} else {
					const subTarget = observer.target[prop]
					if (isObserverTarget(subTarget)) {
						subObserver = loadSubObserver(observer, prop, subTarget)
					}
					//#if _DEBUG
					else if (!isNil(subTarget)) {
						sub.__badPath(2, toStrType(subTarget))
					}
					//#endif
				}
				sub.__bind(subObserver)
			}

			// 2. attach subtopic
			sub.__state |= TOPIC_ENABLED_FLAG
			subs.push(sub)
		}

		this.__state |= TOPIC_SUB_FLAG | TOPIC_ENABLED_FLAG

		return sub
	}

	/**
	 * remove the subtopic from the subs
	 * @param topic topic
	 */
	__removeSub(topic: Topic) {
		const { __subs: subs } = this
		const l = subs.length
		let i = l
		while (i--) {
			if (topic === subs[i]) {
				subs.splice(i, 1)
				l === 1 && (this.__state &= ~TOPIC_SUB_FLAG)
				return
			}
		}
		assert('un-attached topic')
	}

	//#if _DEBUG
	private __badPath(i: number, type: string, msg?: string) {
		const path = this.__getPath()
		console.warn(
			`observer[{}]: can not watch {} on {}{}{}.`,
			formatPath(path),
			formatPath(path.slice(-i)),
			type,
			path.length > i ? `[${formatPath(path.slice(0, -i))}]` : '',
			msg || '',
			this.__owner.target
		)
	}

	private __badSubsPath(subs: Topic[], len: number, type: string) {
		for (let i = 0; i < len; i++) {
			subs[i].__badPath(2, type)
		}
	}

	private __getPath() {
		let path: string[] = this.__path
		if (!path) {
			const { __parent: parent, __prop: prop } = this
			this.__path = path = parent ? parent.__getPath().concat(prop) : [prop]
		}
		return path
	}
	//#endif

	/**
	 * mark the change in topic
	 *
	 * @param original original value
	 */
	__update(original: any) {
		if (this.__original === V) {
			this.__original = original

			// add to collect queue
			const l = collectQueue.length
			collectQueue[l] = this
			!l && nextTick(collect)
		}
	}

	/**
	 * collect the dirty topics(this topic and subtopics) from collectQueue
	 * may collected by parent-topic
	 */
	__collect() {
		const { __original: original } = this
		if (original !== V) {
			const { __observer: observer } = this

			this.__original = V

			this.____collect(observer, observer.target, original, false)
		}
		// this topic has been collected, retains its dirty value
	}

	/**
	 * collect the dirty topics(this topic and subtopics)
	 * - collect from collectQueue
	 * 	1. this topic has been collected, stop collect
	 * 	2. save the dirty value when the topic has a listener
	 * 	3. clean the change state
	 * 	4. collect the subtopics
	 *		use this original value when subtopic has not changed
	 *		use the subtopic's original value when subtopic is changed
	 * 		clean the change state
	 *		replace the new value on subtopics
	 * - re-collect by parent-topic (this does not happen after the topics are sorted by ID before collection)
	 * 	1. replace the new value and discard the original value(keep the existing original value)
	 * 	2. re-collect subtopics
	 *
	 * @param observer 	observer of this topic
	 * @param target 	new target of this topic
	 * @param original 	original value of this topic
	 * @param force  	force notify
	 */
	private ____collect(observer: Observer, target: any, original: any, force: boolean) {
		const { __state: flags, __prop: prop } = this
		let dirty: [any, any, boolean?],
			subTarget: any = V // lazy load the sub-target

		if (flags & TOPIC_LISTEN_FLAG) {
			if (!(dirty = this.__dirty)) {
				this.__dirty = dirty = [, original, force]
				dirtyQueue.push(this)
			} else if (force) {
				dirty[2] = force
				// if this topic has been changed and collected, retains its original value
			}
			// set the new value
			dirty[0] = observer && isArrayChangeProp(observer, prop) ? target : (subTarget = getValue(target, prop))
		}

		if (flags & TOPIC_SUB_FLAG) {
			subTarget === V && (subTarget = getValue(target, prop))

			const { __subs: subs } = this
			const l = subs.length

			var subObserver: Observer,
				orgSubObserver: Observer,
				sub: Topic,
				subOriginal: any,
				i = 0

			if (observer) {
				//#if _DEBUG
				isArrayChangeProp(observer, prop) && this.__badSubsPath(subs, l, 'Array')
				//#endif

				if (isObserverTarget(subTarget)) {
					subObserver = loadSubObserver(observer, prop, subTarget)
					subTarget = subObserver.target
					dirty && (dirty[0] = subObserver.proxy) // update dirty proxy
				}
				//#if _DEBUG
				else if (!isNil(subTarget)) {
					this.__badSubsPath(subs, l, toStrType(subTarget))
				}
				//#endif
			} else if (dirty && policy.__proxy) {
				dirty[0] = proxy(dirty[0])
			}

			for (; i < l; i++) {
				sub = subs[i]
				orgSubObserver = sub.__observer
				if (!subObserver || orgSubObserver != subObserver) {
					sub.__bind(subObserver)

					if ((subOriginal = sub.__original) === V) {
						// 1. this subtopic has not been changed, using the original value of the current topic
						// *2. this subtopic has been changed and collected, and the collector retains its original value
						// *   this does not happen after the topics are sorted by ID before collection
						subOriginal = sub.__dirty ? undefined : getOriginalValue(original, sub.__prop)
					} else {
						// this subtopic was changed but not collected, collected in advance
						sub.__original = V
					}

					sub.____collect(subObserver, subTarget, subOriginal, orgSubObserver != subObserver)
				}
			}
		} else if (dirty && policy.__proxy) {
			dirty[0] = proxy(dirty[0])
		}
	}
}

function compareTopic(topic1: Topic, topic2: Topic) {
	return topic1.__id - topic2.__id
}

/**
 * collect the dirty topics on the collectQueue
 */
function collect() {
	//#if _DEBUG
	const start = Date.now()
	//#endif

	let l = collectQueue.length,
		i = 0

	// sort by topic id
	collectQueue.sort(compareTopic)

	for (; i < l; i++) {
		collectQueue[i].__collect()
	}

	//#if _DEBUG
	console.log(
		`Collect ${dirtyQueue.length} dirty topics from the collection queue (${l}), use ${Date.now() - start}ms`
	)
	//#endif

	notify()
}

/**
 * notify all of the dirty topics
 */
function notify() {
	//#if _DEBUG
	const start = Date.now()
	let topics = 0,
		listens = 0
	//#endif

	const l = dirtyQueue.length
	let topic: Topic,
		owner: Observer,
		path: string[],
		value: any,
		original: any,
		dirty: [any, any, boolean],
		i = 0

	for (; i < l; i++) {
		topic = dirtyQueue[i]
		dirty = topic.__dirty
		value = dirty[0]
		original = dirty[1]

		topic.__dirty = null // clean the dirty

		if (dirty[2] || value !== original || !isPrimitive(value)) {
			// real dirty
			owner = topic.__owner
			path = topic.__path
			topic.__listeners.each((fn, scope) => {
				scope ? fn.call(scope, path, value, original, owner) : fn(path, value, original, owner)

				//#if _DEBUG
				listens++
				//#endif
			})

			//#if _DEBUG
			topics++
			//#endif
		}
	}

	//#if _DEBUG
	console.log(
		`${listens} listen-callbacks of ${topics}/${l} dirty topics have been notified, use ${Date.now() - start}ms`
	)
	//#endif
}

//========================================================================================
/*                                                                                      *
 *                                       Observer                                       *
 *                                                                                      */
//========================================================================================

let __original__: any
function __updateTopicCB(topic: Topic) {
	topic.__update(__original__)
}

// const watcherQueue: Watcher[] = []
// function collectWatchers() {
// 	__original__ = original
// 	this.eachUnsafe(__updateTopicCB)
// 	__original__ = 0
// }

class Watcher extends List<Topic> implements IWatcher {
	// __originValue: any

	constructor() {
		super()
	}
	/**
	 * notify topics
	 * @param original the original value
	 */
	notify(original: any) {
		__original__ = original
		this.eachUnsafe(__updateTopicCB)
		__original__ = 0

		// if (this.__originValue === V) {
		// 	const l = collectQueue.length

		// 	this.__originValue = original

		// 	watcherQueue[l] = this
		// 	!l && nextTick(collectWatchers)
		// }
	}
}

class Observer implements IObserver {
	/**
	 * observer target
	 */
	readonly target: ObserverTarget

	/**
	 * observer proxy
	 */
	proxy: ObserverTarget

	/**
	 * is array target
	 */
	readonly isArray: boolean

	/**
	 * topics
	 * 	- key: property of topic in the observer's target
	 * 	- value: topic
	 */
	__topics: { [key: string]: Topic }

	/**
	 * watchers
	 * 	- key: property of watcher in the observer's target
	 * 	- value: watcher
	 */
	readonly __watchers: { [key: string]: Watcher }

	/**
	 * properties of watchers in the observer's target
	 */
	readonly __watcherProps: string[]

	/**
	 * create Observer
	 * @param target observer target
	 */
	constructor(target: ObserverTarget) {
		const arrayTarget = isArray(target)
		if (arrayTarget) {
			applyArrayHooks(target as any[])
		} else {
			assert.is(isObj(target), `the observer's target can only be an object or an array`)
		}

		const watchers = create(null)
		this.__watchers = watchers
		this.__watcherProps = []

		this.isArray = arrayTarget
		this.target = target
		this.proxy = policy.__createProxy(target, arrayTarget, watchers)

		// bind observer key on the observer's target
		defPropValue(target, OBSERVER_KEY, this, false, false, false)
	}

	/**
	 * observe changes in the observer's target
	 * @param propPath 	property path for observe, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 * @return listen-id
	 */
	observe(propPath: string | string[], cb: ObserverCallback, scope?: any) {
		const path: string[] = parsePath(propPath),
			topics = this.__topics || (this.__topics = create(null)),
			prop0 = path[0]

		let topic = topics[prop0] || (topics[prop0] = new Topic(this, prop0)),
			i = 1,
			l = path.length

		topic.__bind(this)
		topic.__flags |= TOPIC_ENABLED_FLAG

		for (; i < l; i++) {
			topic = topic.__addSub(path[i])
		}

		return topic.__listen(path, cb, scope)
	}

	/**
	 * cancel observing the changes in the observer's target
	 * @param propPath	property path for unobserve, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 */
	unobserve(propPath: string | string[], cb: ObserverCallback, scope?: any) {
		const topic = this.__getTopic(parsePath(propPath))
		topic && topic.__unlisten(cb, scope)
	}

	/**
	 * cancel observing the changes in the observer's target by listen-id
	 * @param propPath	property path for unobserve, parse string path by {@link parsePath}
	 * @param id 		listen-id
	 */
	unobserveId(propPath: string | string[], id: string) {
		const topic = this.__getTopic(parsePath(propPath))
		topic && topic.__unlistenId(id)
	}

	/**
	 * notify the observer that the property in the target has been changed
	 * @param prop		changed property
	 * @param original	the original value
	 */
	notify(prop: string, original: any) {
		const watcher = this.__watchers[prop]
		watcher && watcher.notify(original)
	}

	/**
	 * notify the observer that all properties in the target have changed
	 * the original value well be {@link MISS}
	 */
	notifyAll() {
		const { __watchers: watchers, __watcherProps: props } = this
		for (var i = 0, watcher: Watcher, l = props.length; i < l; i++) {
			watcher = watchers[props[i]]
			watcher.notify(MISS)
		}
	}

	/**
	 * get watcher of the property
	 * @protected
	 * @param prop
	 */
	watcher(prop: string) {
		const watcher = this.__watchers[prop]
		if (watcher && watcher.size()) return watcher
	}

	/**
	 * watch the topic
	 * @private
	 * @param topic topic
	 * @return is successful
	 */
	__watchTopic(topic: Topic): boolean {
		const { __watchers: watchers } = this
		const { __prop: prop } = topic
		let watcher: Watcher = watchers[prop]
		if (!watcher) {
			watcher = new Watcher()
			if (!(this.isArray && prop === ARRAY_CHANGE) && policy.__watch(this, prop, watcher) === false) return false
			watchers[prop] = watcher
			this.__watcherProps.push(prop)
		}
		watcher.add(topic)
		return true
	}

	/**
	 * unwatched the topic
	 * @private
	 * @param topic topic
	 */
	__unwatchTopic(topic: Topic) {
		this.__watchers[topic.__prop].remove(topic)
	}

	/**
	 * get topic by property path
	 * @param path property path of topic, parse string path by {@link parsePath}
	 * @return topic | undefined
	 */
	private __getTopic(path: string[]) {
		const { __topics: topics } = this
		let topic: Topic
		if (topics && (topic = topics[path[0]])) {
			for (var i = 1, l = path.length; i < l; i++) {
				if (!(topic = topic.__getSub(path[i]))) break
			}
		}
		return topic
	}

	/**
	 * set value
	 * @param propPath 	property path for set, parse string path by {@link parsePath}
	 * @param value		the value
	 */
	set(propPath: string | string[], value: any) {
		$set(this.proxy, propPath, value)
	}

	/**
	 * get value
	 * @param propPath 	property path for get, parse string path by {@link parsePath}
	 * @return the value
	 */
	get(propPath: string | string[]): any {
		return $get(this.target, propPath)
	}

	/**
	 * @ignore
	 */
	toJSON() {}
}

//========================================================================================
/*                                                                                      *
 *                                      Array Hooks                                     *
 *                                                                                      */
//========================================================================================

type ArrayHook = [string, (...args: any[]) => any]
const arrayHooks = mapArray(
	'fill,pop,push,reverse,shift,sort,splice,unshift'.split(','),
	(method: string): ArrayHook => {
		const fn = Array[PROTOTYPE][method]
		return [
			method,
			function() {
				const observer: Observer = this[OBSERVER_KEY]
				observer.notifyAll()
				return applyScope(fn, observer.target, arguments)
			}
		]
	}
)

/**
 * apply observer hooks on Array
 * @param array
 */
function applyArrayHooks(array: any[]) {
	let hook: ArrayHook,
		i = arrayHooks.length
	while (i--) {
		hook = arrayHooks[i]
		defPropValue(array, hook[0], hook[1], false, false, false)
	}
}

//========================================================================================
/*                                                                                      *
 *                                        policy                                        *
 *                                                                                      */
//========================================================================================

const policy: ObserverPolicy = proxyPolicy() || accessorPolicy()

assert.is(policy, 'The observer module is not supported.')

//#if _DEBUG
console.info(`the observer policy: ${policy.__name} -> `, policy)
//#endif

if (!policy.__createProxy) policy.__createProxy = target => target
if (!policy.__watch) policy.__watch = () => true

/**
 * get existing observer on object
 * @return existing observer
 */
let getObserver: (target: ObserverTarget) => Observer = (target: ObserverTarget): Observer => {
	const oserver: Observer = target[OBSERVER_KEY]
	if ((oserver && oserver.target === target) || oserver.proxy === target) return oserver
}

/**
 * get or create sub-observer
 * fix proxy value
 * @param observer 	observer
 * @param prop		property of the observer's target
 * @param target	target = observer.target[prop]
 * @return sub-observer
 */
let loadSubObserver: (observer: Observer, prop: string, target: any) => Observer = (
	observer: Observer,
	prop: string,
	target: any
): Observer => {
	const subObserver: Observer = getObserver(target) || new Observer(target)
	if (subObserver.proxy !== target) observer.target[prop] = subObserver.proxy
	return subObserver
}

/**
 * get the original object of the observer on the object
 * @param object the object
 * @return the original object | the object
 */
let source: <T>(obj: T) => T = <T>(obj: T): T => {
	const observer = obj && getObserver(obj)
	return observer ? (observer.target as T) : obj
}

/**
 * get the proxy object for the observer on the object
 * @param object the object
 * @return the proxy object | the object
 */
let proxy: <T>(obj: T) => T = <T>(obj: T): T => {
	const observer = obj && getObserver(obj)
	return observer ? (observer.proxy as T) : obj
}

/**
 * support equals function between observer objects
 */
let $eq: (o1: any, o2: any) => boolean = (o1, o2) => {
	return eq(o1, o2) || (o1 && o2 && (o1 = getObserver(o1)) ? o1 === getObserver(o2) : false)
}

let $get: (obj: any, path: string | string[]) => any = (obj: any, path: string | string[]): any => {
	return proxy(get(obj, path))
}

let $set: (obj: any, path: string | string[], value: any) => void = (obj: any, path: string | string[], value: any) => {
	path = parsePath(path)
	const l = path.length - 1
	let i = 0,
		v: any
	for (; i < l; i++) {
		v = obj[path[i]]
		obj = v === null || v === undefined ? (proxy(obj)[path[i]] = {}) : v
	}
	proxy(obj)[path[i]] = proxy(value)
}

//──── optimize on Non-Proxy policy ──────────────────────────────────────────────────────
if (!policy.__proxy) {
	getObserver = (target: ObserverTarget): Observer => {
		const oserver: Observer = target[OBSERVER_KEY]
		if (oserver && oserver.target === target) return oserver
	}

	loadSubObserver = (observer: Observer, prop: string, target: any): Observer => {
		return getObserver(target) || new Observer(target)
	}

	source = obj => obj

	proxy = source

	$eq = eq

	$get = get

	$set = set
}

export { getObserver, source, proxy, $eq, $get, $set }

//========================================================================================
/*                                                                                      *
 *                                     test topic                                     *
 *                                                                                      */
//========================================================================================
/*
const objIdGen: { [key: string]: number } = {}
function objId(obj: any, str: string) {
	return obj.id || (obj.id = str + '-' + (objIdGen[str] ? ++objIdGen[str] : (objIdGen[str] = 1)))
}
function topicState(topic: Topic) {
	const path = []
	let p = topic
	while (p) {
		path.unshift(p.__prop)
		p = p.__parent
	}
	const subs = topic.__subs && topic.__subs.length
	const listeners = topic.__listeners && topic.__listeners.size()

	assert.is(!!(subs || listeners) === !!(topic.__state & TOPIC_ENABLED_FLAG))
	assert.is(!!subs === !!(topic.__state & TOPIC_SUB_FLAG))
	assert.is(!!listeners === !!(topic.__state & TOPIC_LISTEN_FLAG))
	assert.is(!topic.__observer || topic.__state & TOPIC_ENABLED_FLAG)

	return {
		id: objId(topic, 'topic'),
		path: formatPath(path),
		obj: JSON.stringify(topic.__owner.target),
		enabled: !!(subs || listeners),
		listeners: listeners,
		watched: topic.__observer && {
			id: objId(topic.__observer, 'observer'),
			obj: JSON.stringify(topic.__observer.target),
			watchs: watchs(topic.__observer)
		},
		subCache: topic.__subCache && map(topic.__subCache, topicState),
		subs: subs && map(topic.__subs, sub => objId(sub, 'topic'))
	}
}
function observerState(observer: Observer) {
	return {
		id: objId(observer, 'observer'),
		obj: JSON.stringify(observer.target),
		watchs: watchs(observer),
		topics: map(observer.__topics, subj => topicState(subj))
	}
}
function watchs(observer: Observer) {
	return map(observer.__watchers, w =>
		w
			.toArray()
			.map(s => objId(s, 'topic'))
			.join(', ')
	)
}

function logState(obs: Observer) {
	const state = observerState(obs)
	console.log(JSON.stringify(state, null, '  '))
}
let obs = new Observer({ a: { b: { c: 1 } } })
let id1 = obs.observe('a.b.c', () => {})
let id2 = obs.observe('a.b.d', () => {})
//logState(obs)
obs.unobserveId('a.b.c', id1)
obs.unobserveId('a.b.c', id1)
//logState(obs)
obs.unobserveId('a.b.d', id2)

//logState(obs)
id1 = obs.observe('a.b.c', function() {
	console.log('a.b.c', arguments)
})
id2 = obs.observe('a.b.d', function() {
	console.log('a.b.d', arguments)
})
//logState(obs)

const ov = obs.target['a']
obs.target['a'] = { b: { d: 2 } }
obs.notify('a', ov)

setTimeout(function() {
	//logState(obs)
}, 1000)

//logState(obs)
 */
