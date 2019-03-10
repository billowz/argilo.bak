/**
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Dec 26 2018 13:59:10 GMT+0800 (China Standard Time)
 * @modified Sun Mar 10 2019 11:04:55 GMT+0800 (China Standard Time)
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
	map
} from '../utility'
import { PROTOTYPE } from '../utility/consts'
import { assert } from '../utility/assert'

export type ObserverTarget = any[] | {}

/**
 * @param path 		the observe path
 * @param value 	new value
 * @param original	original value. the original value is {@link MISS} when the dirty collector loses the original value
 */
export type ObserverCallback = (path: string[], value: any, original: any, observer: Observer) => void

/**
 * the property of observe an array change
 */
export const ARRAY_CHANGE = '$change'

/**
 * The dirty collector lost the original value
 */
export const MISS = {}

//========================================================================================
/*                                                                                      *
 *                                        topic                                       *
 *                                                                                      */
//========================================================================================

const V = {}

function isObserverTarget(obj: any) {
	return obj && (isArray(obj) || isObj(obj))
}

/**
 * get or create sub-observer
 * fix proxy value
 * @param observer 	observer
 * @param prop		property of observer target
 * @param target	target = observer.target[prop]
 * @return sub-observer
 */
function loadSubObserver(observer: Observer, prop: string, target: any): Observer {
	const subObserver: Observer = getObserver(target) || observer.observerOf(target)
	if (subObserver.proxy !== target) observer.target[prop] = subObserver.proxy
	return subObserver
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
 * get property value on original object
 * check {@link MISS}
 * @param original 	object
 * @param prop 		property
 */
function getOriginalValue(original: any, prop: string) {
	return original === undefined || original === null ? undefined : original === MISS ? original : original[prop]
}

// id generator of topic
let topicIdGen = 0

const collectQueue: Topic[] = [], // the dirty topic queue waiting for collection
	dirtyQueue: Topic[] = [] // the dirty topic queue waiting for notification

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

	// collected dirty value: [new value, original value]
	__dirty: [any, any]

	// subtopics
	__subs: Topic[]

	// cache of subtopics
	__subCache: { [key: string]: Topic }

	// flags: TOPIC_ENABLED_FLAG | TOPIC_LISTEN_FLAG | TOPIC_SUB_FLAG
	__flags: number

	/**
	 * create a Topic
	 * @param owner		own observer
	 * @param prop		watch property
	 * @param parent	parent topic
	 */
	constructor(owner: Observer, prop: string, parent?: Topic) {
		this.__flags = 0
		this.__original = V
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
		id && (this.__flags |= TOPIC_LISTEN_FLAG | TOPIC_ENABLED_FLAG)
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
	 * Clear all unlistening leaf topics
	 * @param listeners	listeners
	 */
	private ____unlisten(listeners: FnList<ObserverCallback>) {
		if (!listeners.size()) {
			var topic: Topic = this,
				parent: Topic
			topic.__flags &= ~TOPIC_LISTEN_FLAG
			while ((topic.__flags & (TOPIC_SUB_FLAG | TOPIC_LISTEN_FLAG | TOPIC_ENABLED_FLAG)) === TOPIC_ENABLED_FLAG) {
				topic.__bind()
				topic.__flags = 0
				if (!(parent = topic.__parent)) break
				parent.__removeSub(topic)
				topic = parent
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
			if (!observer || observer.__watchTopic(this) === false) observer = undefined
			this.__observer = observer && observer.__watchTopic(this) !== false ? observer : observer
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

		if (!(sub.__flags & TOPIC_ENABLED_FLAG)) {
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
			sub.__flags |= TOPIC_ENABLED_FLAG
			subs.push(sub)
		}

		this.__flags |= TOPIC_SUB_FLAG | TOPIC_ENABLED_FLAG

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
				l === 1 && (this.__flags &= ~TOPIC_SUB_FLAG)
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
	 * collect the dirty topics(current and sub topics) from collectQueue
	 * may collected by parent-topic
	 */
	__collect() {
		const { __original: original } = this
		if (original !== V) {
			const { __observer: observer } = this

			this.__original = V

			this.____collect(observer, observer.target, original)
		}
	}

	/**
	 * collect dirty topics
	 * - Case 1:
	 * 	1. collect from collectQueue
	 * 		1. clean changed flag
	 * 		2. save dirty values
	 * 		3. collect the subtopics
	 * 			default use the new and original value
	 * 			use the subtopic's original value when subtopic is changed
	 * 			clean subtopic's changed flag
	 * 	2. re-collect by parent-topic
	 * 		1. replace the new value and discard the original value(keep the existing original value)
	 * 		2. re-collect subtopics
	 *
	 * @param observer 	observer of this topic
	 * @param target 	new target of this topic
	 * @param original 	original value of this topic
	 */
	private ____collect(observer: Observer, target: any, original: any) {
		const { __flags: flags, __prop: prop } = this
		let dirty: [any, any],
			subTarget: any = V // lazy load the sub-target

		if (flags & TOPIC_LISTEN_FLAG) {
			if (!(dirty = this.__dirty)) {
				this.__dirty = dirty = [, original]
				dirtyQueue.push(this)
			} // if this topic has been changed and collected, retains its original value

			dirty[0] = observer && isArrayChangeProp(observer, prop) ? target : (subTarget = getValue(target, prop))
		}

		if (flags & TOPIC_SUB_FLAG) {
			subTarget === V && (subTarget = getValue(target, prop))

			const { __subs: subs } = this
			const l = subs.length

			var subObserver: Observer,
				sub: Topic,
				subOriginal: any,
				i = 0

			if (observer) {
				//#if _DEBUG
				isArrayChangeProp(observer, prop) && this.__badSubsPath(subs, l, 'Array')
				//#endif

				if (isObserverTarget(subTarget)) {
					subObserver = loadSubObserver(observer, this.__prop, subTarget)
					subTarget = subObserver.target
					dirty && (dirty[0] = subObserver.proxy) // update dirty proxy
				}
				//#if _DEBUG
				else if (!isNil(subTarget)) {
					this.__badSubsPath(subs, l, toStrType(subTarget))
				}
				//#endif
			}

			for (; i < l; i++) {
				sub = subs[i]

				if (!subObserver || sub.__observer != subObserver) {
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

					sub.____collect(subObserver, subTarget, subOriginal)
				}
			}
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
		dirty: [any, any],
		i = 0

	for (; i < l; i++) {
		topic = dirtyQueue[i]
		dirty = topic.__dirty
		value = dirty[0]
		original = dirty[1]

		topic.__dirty = null // clean the dirty

		if (value !== original || !isPrimitive(value)) {
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

/**
 */
class Watchers extends List<Topic> {
	__watched: boolean
	/**
	 *
	 */
	notify(original: any) {
		this.eachUnsafe(topic => topic.__update(original))
	}
}

export const OBSERVER_KEY = '__observer__'
export function getObserver(target: ObserverTarget) {
	const oserver: Observer = target[OBSERVER_KEY]
	if (oserver && (oserver.target === target || oserver.proxy === target)) return oserver
}
let disableUpdate = false
export class Observer {
	/**
	 * original object
	 */
	readonly target: ObserverTarget

	/**
	 * proxy object
	 */
	proxy: ObserverTarget

	/**
	 * is array
	 */
	readonly isArray: boolean

	/**
	 * topics
	 * 	- key: property of original object
	 * 	- value: topic
	 */
	__topics: { [key: string]: Topic }

	/**
	 * watched topics
	 * 	- key: property of original object
	 * 	- value: topics
	 */
	readonly __watchs: { [key: string]: Watchers }

	/**
	 * create Observer
	 * @param target original object
	 */
	constructor(target: ObserverTarget) {
		this.__watchs = create(null)

		this.target = target
		this.proxy = target

		if ((this.isArray = isArray(target))) applyArrayHooks(target as any[])

		assert.is(isObj(target), `the observer target can only be an object or an array`)

		// bind observer key on original object
		defPropValue(target, OBSERVER_KEY, this, false, false, false)
	}

	/**
	 * observe property path
	 * @param propPath 	property path of original object, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 */
	observe(propPath: string | string[], cb: ObserverCallback, scope?: any) {
		const path: string[] = parsePath(propPath),
			topics = this.__topics || (this.__topics = create(null)),
			prop0 = path[0]

		let topic = topics[prop0] || (topics[prop0] = new Topic(this, prop0)),
			i = 1,
			l = path.length

		topic.__bind(this)

		for (; i < l; i++) {
			topic = topic.__addSub(path[i])
		}

		return topic.__listen(path, cb, scope)
	}

	/**
	 * unobserve property path
	 * @param propPath	property path on object
	 * @param cb		callback
	 * @param scope		scope of cb
	 */
	unobserve(propPath: string | string[], cb: ObserverCallback, scope?: any) {
		const topic = this.__getTopic(parsePath(propPath))
		topic && topic.__unlisten(cb, scope)
	}

	/**
	 * unobserve property path
	 * @param propPath	property path on object
	 * @param id 		listen-id
	 */
	unobserveId(propPath: string | string[], id: string) {
		const topic = this.__getTopic(parsePath(propPath))
		topic && topic.__unlistenId(id)
	}

	/**
	 * update property value and notify changes
	 * @param prop		property
	 * @param original	original value
	 */
	update(prop: string, original: any) {
		if (!disableUpdate) {
			const watchers = this.__watchs[prop]
			watchers && watchers.size() && watchers.notify(original)
		}
	}

	updateAll() {
		if (!disableUpdate) {
			const { __watchs: watchs } = this
			var prop: string, watchers: Watchers
			for (prop in watchs) {
				watchers = watchs[prop]
				watchers.size() && watchers.notify(MISS)
			}
		}
	}

	_watchers(prop: string) {
		if (!disableUpdate) {
			const watchers = this.__watchs[prop]
			if (watchers && watchers.size()) return watchers
		}
	}

	/**
	 * watch property
	 * @abstract
	 * @protected
	 * @param prop	property
	 */
	_watch(prop: string): boolean | void {
		return true //assert('abstruct')
	}

	/**
	 * get or create observer
	 * @abstract
	 * @protected
	 */
	observerOf(target: any): Observer {
		return new Observer(target) //assert('abstruct')
	}

	/**
	 *
	 * @param path
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
	 * watch topic
	 * @private
	 * @param topic
	 */
	__watchTopic(topic: Topic): boolean | void {
		const { __watchs: watchs } = this
		const { __prop: prop } = topic
		const topics: Watchers = watchs[prop] || (watchs[prop] = new Watchers()),
			state = topics.__watched

		if (state === undefined) return (topics.__watched = this._watch(prop) !== false)
		state && topics.add(topic)
	}

	/**
	 * remove watched topic
	 * @private
	 * @param topic
	 */
	__unwatchTopic(topic: Topic) {
		this.__watchs[topic.__prop].remove(topic)
	}

	/**
	 * @ignore
	 */
	toJSON() {}
}

function isArrayChangeProp(observer: Observer, prop: string) {
	return observer.isArray && prop === ARRAY_CHANGE
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
				observer.updateAll()
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
 *                                     test topic                                     *
 *                                                                                      */
//========================================================================================

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

	assert.is(!!(subs || listeners) === !!(topic.__flags & TOPIC_ENABLED_FLAG))
	assert.is(!!subs === !!(topic.__flags & TOPIC_SUB_FLAG))
	assert.is(!!listeners === !!(topic.__flags & TOPIC_LISTEN_FLAG))
	assert.is(!topic.__observer || topic.__flags & TOPIC_ENABLED_FLAG)

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
	return map(observer.__watchs, w =>
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
obs.update('a', ov)

setTimeout(function() {
	//logState(obs)
}, 1000)

//logState(obs)
