/**
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Dec 26 2018 13:59:10 GMT+0800 (China Standard Time)
 * @modified Thu Apr 04 2019 20:06:01 GMT+0800 (China Standard Time)
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
	isPrimitive,
	nextTick,
	isNil,
	toStrType,
	get,
	eq,
	set,
	isObject,
	eachArray,
	eachObj,
	isFn,
	SKIP
} from '../utility'
import { PROTOTYPE } from '../utility/consts'
import { assert } from '../utility/assert'
import {
	ObserverTarget,
	IWatcher,
	OBSERVER_KEY,
	IObserver,
	ARRAY_CHANGE,
	MISS,
	ObserverCallback,
	ARRAY_LENGTH
} from './IObserver'
import { ObservePolicy } from './ObservePolicy'
import proxyPolicy from './ProxyPolicy'
import accessorPolicy from './AccessorPolicy'
import vbPolicy from './VBPolicy'

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
	return obj && (isArray(obj) || isObject(obj))
}

/**
 * is array change property
 * @param observer 	observer
 * @param prop 		property of the observer's target
 */
function isArrayChangeProp<T extends ObserverTarget>(observer: IObserver<T>, prop: string) {
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
	readonly __owner: Observer<any>

	// watch property
	readonly __prop: string

	// binded observer
	__observer: Observer<any>

	// property path
	__path: string[]

	// listeners
	__listeners: FnList<ObserverCallback<any>>

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
	constructor(owner: Observer<any>, prop: string, parent?: Topic) {
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
	__listen(path: string[], cb: ObserverCallback<any>, scope: any): string {
		let { __listeners: listeners } = this
		if (!listeners) {
			this.__listeners = listeners = new FnList<ObserverCallback<any>>()
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
	__unlisten(cb: ObserverCallback<any>, scope: any) {
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
	private ____unlisten(listeners: FnList<ObserverCallback<any>>) {
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
	__bind(observer?: Observer<any>) {
		const { __observer: org } = this
		if (org !== observer) {
			org && org.__unwatchTopic(this) // unbind old observer
			if (observer) {
				const err: Error = observer.__watchTopic(this)
				if (err) {
					const path = this.__getPath()
					assert(
						`observer[{}]: can not watch {} on {}{}, {{message}}.`,
						formatPath(path),
						formatPath(path.slice(-1)),
						toStrType(observer.target),
						path.length > 1 ? `[${formatPath(path.slice(0, -1))}]` : '',
						err,
						err,
						this.__owner.target
					)
				}
			}
			this.__observer = observer
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

				var subObserver: Observer<any>

				if (subs[0]) {
					subObserver = subs[0].__observer
				} else if (!isArrayChangeProp(observer, prop)) {
					const subTarget = observer.target[prop]
					if (isObserverTarget(subTarget)) {
						subObserver = __loadSubObserver(observer, prop, subTarget)
					}
					//#if _DEBUG
					else if (!isNil(subTarget)) {
						sub.__ignorePath(2, toStrType(subTarget))
					}
					//#endif
				}
				//#if _DEBUG
				else {
					sub.__ignorePath(2, 'Array')
				}
				//#endif
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
	private __ignorePath(i: number, type: string, msg?: string) {
		const path = this.__getPath()
		console.warn(
			`observer[{}]: ignore {} on {}{}{}.`,
			formatPath(path),
			formatPath(path.slice(-i)),
			type,
			path.length > i ? `[${formatPath(path.slice(0, -i))}]` : '',
			msg || '',
			this.__owner.target
		)
	}

	private __ignoreSubPaths(subs: Topic[], len: number, type: string) {
		for (let i = 0; i < len; i++) {
			subs[i].__ignorePath(2, type)
		}
	}

	//#endif

	private __getPath() {
		let path: string[] = this.__path
		if (!path) {
			const { __parent: parent, __prop: prop } = this
			this.__path = path = parent ? parent.__getPath().concat(prop) : [prop]
		}
		return path
	}

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

			observer && this.____collect(observer, observer.target, original, false)
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
	private ____collect(observer: Observer<any>, target: any, original: any, force: boolean) {
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

			var subObserver: Observer<any>,
				orgSubObserver: Observer<any>,
				sub: Topic,
				subOriginal: any,
				i = 0

			if (observer) {
				if (!isArrayChangeProp(observer, prop)) {
					if (isObserverTarget(subTarget)) {
						subObserver = __loadSubObserver(observer, prop, subTarget)
						if (proxyEnable) {
							subTarget = subObserver.target
							dirty && (dirty[0] = subObserver.proxy) // update dirty proxy
						}
					}
					//#if _DEBUG
					else if (!isNil(subTarget)) {
						this.__ignoreSubPaths(subs, l, toStrType(subTarget))
					}
					//#endif
				}
				//#if _DEBUG
				else {
					this.__ignoreSubPaths(subs, l, 'Array')
				}
				//#endif
			} else if (proxyEnable && dirty) {
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
		} else if (dirty && proxyEnable) {
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
export function collect() {
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

	collectQueue.length = 0

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
		owner: Observer<any>,
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

	dirtyQueue.length = 0

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

class Watcher extends List<Topic> implements IWatcher {
	constructor() {
		super()
	}
	/**
	 * notify topics
	 *
	 * @param original the original value
	 */
	notify(original: any) {
		__original__ = original
		this.eachUnsafe(__updateTopicCB)
		__original__ = 0
	}
}

class Observer<T extends ObserverTarget> implements IObserver<T> {
	/**
	 * observer target
	 */
	readonly target: T

	/**
	 * observer proxy
	 */
	readonly proxy: T

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
	 *
	 * @param target observer target
	 */
	constructor(target: T) {
		const arrayTarget = isArray(target)

		assert.is(arrayTarget || isObject(target), `the observer's target can only be an object or an array`)

		const watchers = create(null)
		this.__watchers = watchers
		this.__watcherProps = []

		this.isArray = arrayTarget
		this.target = target

		// bind observer key on the observer's target
		defPropValue(target, OBSERVER_KEY, this, false, false, false)

		this.proxy = policy.__createProxy(this, target, arrayTarget)
	}

	/**
	 * observe changes in the observer's target
	 *
	 * @param propPath 	property path for observe, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 * @return listen-id
	 */
	observe(propPath: string | string[], cb: ObserverCallback<T>, scope?: any): string {
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
	 * get listen-id of callback in the observer's target
	 *
	 * @param propPath 	property path for observe, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 * @return listen-id
	 */
	observed(propPath: string | string[], cb: ObserverCallback<T>, scope?: any): string {
		const topic = this.__getTopic(parsePath(propPath))
		let listeners: FnList<ObserverCallback<any>>
		return topic && (listeners = topic.__listeners) && listeners.has(cb, scope)
	}

	/**
	 * has listen-id in the observer's target
	 *
	 * @param propPath 	property path for observe, parse string path by {@link parsePath}
	 * @param id		listen-id
	 * @return listen-id
	 */
	observedId(propPath: string | string[], id: string): boolean {
		const topic = this.__getTopic(parsePath(propPath))
		let listeners: FnList<ObserverCallback<any>>
		return topic && (listeners = topic.__listeners) && listeners.hasId(id)
	}

	/**
	 * cancel observing the changes in the observer's target
	 *
	 * @param propPath	property path for unobserve, parse string path by {@link parsePath}
	 * @param cb		callback
	 * @param scope		scope of callback
	 */
	unobserve(propPath: string | string[], cb: ObserverCallback<T>, scope?: any) {
		const topic = this.__getTopic(parsePath(propPath))
		topic && topic.__unlisten(cb, scope)
	}

	/**
	 * cancel observing the changes in the observer's target by listen-id
	 *
	 * @param propPath	property path for unobserve, parse string path by {@link parsePath}
	 * @param id 		listen-id
	 */
	unobserveId(propPath: string | string[], id: string) {
		const topic = this.__getTopic(parsePath(propPath))
		topic && topic.__unlistenId(id)
	}

	/**
	 * notify change on the property
	 *
	 * @param prop		the property
	 * @param original 	the original value
	 */
	notify(prop: string, original: any) {
		const watcher = this.__watchers[prop]
		watcher && watcher.notify(original)
	}

	/**
	 * notify the observer that properties in the target have changed
	 *
	 * @param props 		notify properties, notify all watchers when the props is null or undefined
	 * @param getOriginal	get the original value
	 * @param execludes		do not notify watchers in execludes
	 */
	notifies(props: string[], getOriginal: (prop: string, ob: Observer<T>) => any, execludes?: { [key: string]: any }) {
		props || (props = this.__watcherProps)
		const { __watchers: watchers } = this
		let prop: string,
			watcher: Watcher,
			i = props.length,
			origin: any
		if (execludes) {
			while (i--) {
				prop = props[i]
				if (!execludes[prop] && (watcher = watchers[prop]) && watcher.size()) {
					origin = getOriginal(prop, this)
					origin !== SKIP && watcher.notify(origin)
				}
			}
		} else {
			while (i--) {
				prop = props[i]
				if ((watcher = watchers[prop]) && watcher.size()) {
					origin = getOriginal(prop, this)
					origin !== SKIP && watcher.notify(origin)
				}
			}
		}
	}

	/**
	 * get wather by property
	 *
	 * @protected
	 * @param prop the property
	 */
	watcher(prop: string): Watcher {
		const watcher = this.__watchers[prop]
		if (watcher && watcher.size()) return watcher
	}

	/**
	 * get or create wather by property
	 *
	 * @protected
	 * @param prop the property
	 */
	initWatcher(prop: string): Watcher {
		const { __watchers: watchers } = this
		let watcher: Watcher = watchers[prop]
		if (!watcher) {
			watchers[prop] = watcher = new Watcher()
			this.__watcherProps.push(prop)
			const err: Error | void = policy.__watch(this as IObserver<T>, prop, watcher)
			assert.not(err, `can not watch property[{}] on the Observer, {{message}}`, prop, err, err, this.target)
		}
		return watcher
	}

	/**
	 * watch the topic
	 *
	 * @private
	 * @param topic topic
	 * @return is successful
	 */
	__watchTopic(topic: Topic): Error {
		const { __watchers: watchers } = this
		const { __prop: prop } = topic
		let watcher: Watcher = watchers[prop],
			err: Error | void
		if (!watcher) {
			watchers[prop] = watcher = new Watcher()
			this.__watcherProps.push(prop)
			err = policy.__watch(this as IObserver<T>, prop, watcher)
		}
		watcher.add(topic)
		return err as Error
	}

	/**
	 * unwatched the topic
	 *
	 * @private
	 * @param topic topic
	 */
	__unwatchTopic(topic: Topic) {
		this.__watchers[topic.__prop].remove(topic)
	}

	/**
	 * get topic by property path
	 *
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
	 * get the value at path of target object
	 *
	 * @param propPath 	property path of target object, parse string path by {@link parsePath}
	 * @return the value
	 */
	get(propPath: string | string[]): any {
		return $get(this.target, propPath)
	}

	/**
	 * set the value at path of target object
	 *
	 * @param propPath 	property path for target object, parse string path by {@link parsePath}
	 * @param value		the value
	 */
	set(propPath: string | string[], value: any) {
		$set(this.proxy, propPath, value)
	}

	/**
	 * @ignore
	 */
	toJSON() {}
}

//========================================================================================
/*                                                                                      *
 *                                        policy                                        *
 *                                                                                      */
//========================================================================================

const policy: ObservePolicy = proxyPolicy() || accessorPolicy() || vbPolicy()

assert.is(policy, 'The observer module is not supported.')

//#if _DEBUG
console.info(`the observer policy: ${policy.__name} -> `, policy)
//#endif

if (!policy.__createProxy) policy.__createProxy = (observer, target) => target
if (!policy.__watch) policy.__watch = () => {}

export const proxyEnable = policy.__proxy

/**
 * get existing observer on object
 *
 * @return existing observer
 */
let __getObserver: <T extends ObserverTarget>(target: T) => Observer<T> = target => {
	const ob = target[OBSERVER_KEY]
	if (ob && (ob.target === target || ob.proxy === target)) return ob
}

/**
 * get or create sub-observer (well fix proxy value)
 *
 * @param observer 	observer
 * @param prop		property of the observer's target
 * @param target	target = observer.target[prop]
 * @return sub-observer
 */
let __loadSubObserver: <T extends ObserverTarget>(observer: Observer<any>, prop: string, target: T) => Observer<T> = (
	observer,
	prop,
	target
) => {
	const subObserver: Observer<any> = __getObserver(target) || new Observer(target)
	if (subObserver.proxy !== target) observer.target[prop] = subObserver.proxy
	return subObserver
}

/**
 * get the original object of the observer on the object
 *
 * @param object the object
 * @return the original object | the object
 */
let source: <T extends ObserverTarget>(obj: T) => T = <T>(obj: T): T => {
	const observer = obj && __getObserver(obj)
	return observer ? observer.target : obj
}

/**
 * get the proxy object for the observer on the object
 *
 * @param object the object
 * @return the proxy object | the object
 */
let proxy: <T extends ObserverTarget>(obj: T) => T = <T>(obj: T): T => {
	const observer = obj && __getObserver(obj)
	return observer ? observer.proxy : obj
}

/**
 * support equals function between observer objects
 */
let $eq: (o1: any, o2: any) => boolean = (o1, o2) => {
	return eq(o1, o2) || (o1 && o2 && (o1 = __getObserver(o1)) ? o1 === __getObserver(o2) : false)
}

/**
 * get the value at path of object
 *
 * @param obj 		the object
 * @param path		property path of object, parse string path by {@link parsePath}
 * @return the value | the proxy of value
 */
let $get: (obj: any, path: string | string[]) => any = (obj, path) => proxy(get(obj, path))

/**
 * set the value at path of object
 *
 * @param obj 		the object
 * @param path		property path of object, parse string path by {@link parsePath}
 * @param value 	value
 */
let $set: (obj: any, path: string | string[], value: any) => void = (obj, path, value) => {
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
if (!proxyEnable) {
	__getObserver = target => {
		const oserver = target[OBSERVER_KEY]
		if (oserver && oserver.target === target) return oserver
	}

	__loadSubObserver = (observer, prop, target) => {
		return __getObserver(target) || new Observer(target)
	}

	source = obj => obj

	proxy = source

	$eq = eq

	$get = get

	$set = set
}

/**
 * get or create observer on object
 *
 * @param target 	the target object
 */
export function observer<T extends ObserverTarget>(target: T): IObserver<T> {
	return __getObserver(target) || new Observer(target)
}

/**
 * observe changes in the target object
 *
 * @param target 	the target object
 * @param propPath 	property path of object, parse string path by {@link parsePath}
 * @param cb		callback
 * @param scope		scope of callback
 * @return listen-id
 */
export function observe<T extends ObserverTarget>(
	target: T,
	propPath: string | string[],
	cb: ObserverCallback<T>,
	scope?: any
): string {
	const __observer = observer(target)
	return __observer.observe(propPath, cb, scope)
}

/**
 * get listen-id of callback in the target object
 *
 * @param target 	the target object
 * @param propPath 	property path of object, parse string path by {@link parsePath}
 * @param cb		callback
 * @param scope		scope of callback
 * @return listen-id
 */
export function observed<T extends ObserverTarget>(
	target: T,
	propPath: string | string[],
	cb: ObserverCallback<T>,
	scope?: any
): string {
	const __observer = __getObserver(target)
	return __observer && __observer.observed(propPath, cb, scope)
}

/**
 * has listen-id in the target object
 *
 * @param target 	the target object
 * @param propPath 	property path of object, parse string path by {@link parsePath}
 * @param id		listen-id
 */
export function observedId<T extends ObserverTarget>(target: T, propPath: string | string[], id: string): boolean {
	const __observer = __getObserver(target)
	return __observer && __observer.observedId(propPath, id)
}

/**
 * cancel observing the changes in the target object
 *
 * @param target 	the target object
 * @param propPath 	property path of object, parse string path by {@link parsePath}
 * @param cb		callback
 * @param scope		scope of callback
 */
export function unobserve<T extends ObserverTarget>(
	target: T,
	propPath: string | string[],
	cb: ObserverCallback<T>,
	scope?: any
) {
	const __observer = __getObserver(target)
	__observer && __observer.unobserve(propPath, cb, scope)
}

/**
 * cancel observing the changes in the target object by listen-id
 *
 * @param target 	the target object
 * @param propPath 	property path of object, parse string path by {@link parsePath}
 * @param listenId	listen-id
 */
export function unobserveId<T extends ObserverTarget>(target: T, propPath: string | string[], listenId: string) {
	const __observer = __getObserver(target)
	__observer && __observer.unobserveId(propPath, listenId)
}

export const getObserver: <T extends ObserverTarget>(target: T) => IObserver<T> = __getObserver

export { source, proxy, $eq, $get, $set }
