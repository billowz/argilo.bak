/**
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Dec 26 2018 13:59:10 GMT+0800 (China Standard Time)
 * @modified Wed Mar 06 2019 19:43:14 GMT+0800 (China Standard Time)
 */

import {
	makeMap,
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
	toStrType
} from '../utility'
import { PROTOTYPE } from '../utility/consts'
import { assert } from '../utility/assert'

export type ObserverTarget = any[] | {}

export type ObserveListener = (path: string[], value: any, original: any, observer: Observer) => void

function checkObserverTarget(obj: any) {
	return obj && (isArray(obj) || isObj(obj))
}

const collectQueue: Subject[] = [],
	dirtyQueue: Subject[] = []

const SUBJECT_CHANGED_FLAG = 0x1,
	SUBJECT_ENABLED_FLAG = 0x2,
	SUBJECT_LISTEN_FLAG = 0x4,
	SUBJECT_SUB_FLAG = 0x8

let listenerIdGen = 1

/**
 * @ignore
 */
class Subject {
	// parent subject
	readonly __parent: Subject

	// own observer
	readonly __owner: Observer

	// property
	readonly __prop: string

	// binded observer
	__observer: Observer

	// property path
	__path: string[]

	// listeners
	__listeners: FnList<ObserveListener>

	__original: any

	__dirty: [any, any]

	// sub-subjects
	__subs: Subject[]

	// cache of sub-subjects
	__subCache: { [key: string]: Subject }

	__flags: number

	/**
	 *
	 * @param owner
	 * @param prop
	 * @param binded
	 * @param parent
	 */
	constructor(owner: Observer, prop: string, parent?: Subject) {
		this.__owner = owner
		this.__prop = prop
		this.__parent = parent
		this.__flags = 0
	}

	/**
	 * add listener
	 * @param path		path of subject
	 * @param listener	listen callback
	 * @param scope		scope of listen callback
	 */
	__listen(path: string[], listener: ObserveListener, scope: any) {
		let { __listeners: listeners } = this
		if (!listeners) {
			this.__listeners = listeners = new FnList<ObserveListener>()
			this.__path = path
		}
		const id = listeners.add(listener, scope, listenerIdGen++)
		id && (this.__flags |= SUBJECT_LISTEN_FLAG | SUBJECT_ENABLED_FLAG)
		return id
	}

	/**
	 * remove listener
	 * @param listener
	 * @param scope
	 */
	__unlisten(listener: ObserveListener, scope: any) {
		const { __listeners: listeners } = this
		if (listeners) {
			listeners.remove(listener, scope)
			this.____unlisten(listeners)
		}
	}

	/**
	 * remove listener by id
	 * @param id
	 */
	__unlistenId(id: string) {
		const { __listeners: listeners } = this
		if (listeners) {
			listeners.removeId(id)
			this.____unlisten(listeners)
		}
	}

	/**
	 * clean unlistened subjects
	 * @param listeners	listeners
	 */
	private ____unlisten(listeners: FnList<ObserveListener>) {
		if (!listeners.size()) {
			var subject: Subject = this,
				parent: Subject
			subject.__flags &= ~SUBJECT_LISTEN_FLAG
			while (
				(subject.__flags & (SUBJECT_SUB_FLAG | SUBJECT_LISTEN_FLAG | SUBJECT_ENABLED_FLAG)) ===
				SUBJECT_ENABLED_FLAG
			) {
				subject.__bind()
				subject.__flags = 0
				if (!(parent = subject.__parent)) break
				parent.__removeSub(subject)
				subject = parent
			}
		}
	}

	/**
	 * bind observer
	 * @param observer new observer
	 * @return binded observer
	 */
	__bind(observer?: Observer) {
		const { __observer: org } = this
		if (org !== observer) {
			org && org.__unwatch(this) // unbind old observer
			if (observer) {
				if (observer.isArray && !ARRAY_EVENTS[this.__prop]) {
					// unsupported array property

					//#if _DEBUG
					this.__badPath(1, 'Array', ', change to "change" or "length"')
					//#endif
					observer = undefined
				} else {
					observer.__watch(this)
				}
			}
			this.__observer = observer
			return observer
		}
	}

	/**
	 * get sub-subject from cache
	 * @param prop property
	 */
	__getSub(prop: string): Subject {
		const { __subCache: subCache } = this
		return subCache && subCache[prop]
	}

	/**
	 * create or get sub-subject on cache
	 * @param subProp	property
	 * @param binded	binded observer
	 */
	__addSub(subProp: string): Subject {
		// get or init cache and subs
		const subCache: { [key: string]: Subject } =
			this.__subCache || ((this.__subs = []), (this.__subCache = create(null)))

		// get or create sub-subject on cache
		const sub: Subject = subCache[subProp] || (subCache[subProp] = new Subject(this.__owner, subProp, this))

		if (!(sub.__flags & SUBJECT_ENABLED_FLAG)) {
			const { __subs: subs } = this

			// init or re-init sub-subject

			// 1. bind observer
			const { __observer: observer } = this
			if (observer) {
				if (!observer.isArray) {
					sub.__bind(
						subs[0]
							? subs[0].__observer
							: this.__loadSubObserver(observer, this.__prop, observer.target[this.__prop])
					)
				}
				//#if _DEBUG
				else {
					// invalid: bind subject on array-subject
					sub.__badPath(2, 'Array')
				}
				//#endif
			}

			// 2. attach sub-subject
			sub.__flags |= SUBJECT_ENABLED_FLAG
			subs.push(sub)
		}

		this.__flags |= SUBJECT_SUB_FLAG | SUBJECT_ENABLED_FLAG

		return sub
	}

	/**
	 * remove sub-subject
	 * @param subject subject
	 */
	__removeSub(subject: Subject) {
		const { __subs: subs } = this
		const l = subs.length
		let i = l
		while (i--) {
			if (subject === subs[i]) {
				subs.splice(i, 1)
				l === 1 && (this.__flags &= ~SUBJECT_SUB_FLAG)
				return
			}
		}
		assert('un-attached subject')
	}

	private __loadSubObserver(observer: Observer, prop: string, target: any): Observer {
		if (checkObserverTarget(target)) {
			const subObserver: Observer = getObserver(target) || observer.observerOf(target)
			if (subObserver.proxy !== target) observer.target[prop] = subObserver.proxy
			return subObserver
		}
		//#if _DEBUG
		else if (!isNil(target)) {
			this.__badPath(1, toStrType(target), '')
		}
		//#endif
	}

	//#if _DEBUG
	private __badPath(i: number, type: string, msg?: string) {
		const path = this.__getPath()
		console.error(
			`bad path[{}]: not support {} on {}{}{}.`,
			formatPath(path),
			formatPath(path.slice(-i)),
			type,
			path.length > i ? `[${formatPath(path.slice(0, -i))}]` : '',
			msg || '',
			this.__owner.target
		)
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
	 * value changed
	 * @param original original value
	 */
	__update(original: any) {
		if (!(this.__flags & SUBJECT_CHANGED_FLAG)) {
			this.__original = original
			this.__flags |= SUBJECT_CHANGED_FLAG

			// add to collect queue
			const l = collectQueue.length
			collectQueue[l] = this
			!l && nextTick(collect)
		}
	}

	/**
	 * collect changed subjects
	 */
	__collect() {
		if (this.__flags & SUBJECT_CHANGED_FLAG) {
			// may collected by parent-subject

			const { __original: original, __observer: observer } = this

			this.____collect(observer, observer.target, original)

			// clean state and original value
			this.__original = null
			this.__flags &= ~SUBJECT_CHANGED_FLAG
		}
	}

	/**
	 * collect changed subjects
	 * - Case 1:
	 * 	1. collect by collect-queue
	 * 	2. re-collect by parent-subject
	 * 		keep the original value of dirty
	 * 		replace the new value of dirty
	 * - Case 2:
	 * 	1. collect by parent-subject
	 * 	2. re-collect by collect queue
	 * 		replace the original value of dirty
	 * 		keep the new value of dirty
	 * @param observer 	Observer of this subject
	 * @param prop 		property of this subject
	 * @param subTarget new observe target on this subject
	 * @param value 	new value on this subject
	 * @param original 	original value on this subject
	 */
	private ____collect(observer: Observer, target: any, original: any) {
		const { __flags: flags, __prop: prop } = this
		let dirty: [any, any]

		if (flags & SUBJECT_LISTEN_FLAG) {
			if (!(dirty = this.__dirty)) {
				// add to dirty queue
				this.__dirty = dirty = [
					observer
						? observer.isArray && prop === ARRAY_CHANGE_PROP
							? target
							: target[prop]
						: isNil(target)
						? undefined
						: target[prop],
					original
				]
				dirtyQueue.push(this)
			} else {
				dirty[1] = original
			}
		}

		if (flags & SUBJECT_SUB_FLAG) {
			const { __subs: subs } = this
			const l = subs.length

			var subObserver: Observer,
				sub: Subject,
				subTarget: any,
				i = 0

			if (observer) {
				if (!observer.isArray) {
					if ((subObserver = this.__loadSubObserver(observer, prop, dirty[0]))) {
						subTarget = subObserver.target
						dirty && (dirty[0] = subObserver.proxy) // update dirty proxy
					}
				}
				//#if _DEBUG
				else {
					for (; i < l; i++) {
						sub[i].__badPath(2, 'Array')
					}
					i = 0
				}
				//#endif
			}
			for (; i < l; i++) {
				sub = subs[i]
				sub.__bind(subObserver)
				if (!subObserver || sub.__observer != subObserver) {
					sub.____collect(subObserver, subTarget, isNil(original) ? undefined : original[sub.__prop])
				}
			}
		}
	}
}

/**
 * collect changed subjects
 */
function collect() {
	//#if _DEBUG
	const start = Date.now()
	//#endif

	let subject: Subject,
		l = collectQueue.length,
		i = 0
	for (; i < l; i++) {
		subject = collectQueue[i]
		subject.__collect()
	}

	//#if _DEBUG
	console.log(`collect observed subjects: x${dirtyQueue.length} use ${Date.now() - start}ms`)
	//#endif

	notify()
}

/**
 * notify changed subjects
 */
function notify() {
	//#if _DEBUG
	const start = Date.now()
	let subjects = 0,
		listens = 0
	//#endif

	const l = dirtyQueue.length
	let subject: Subject,
		owner: Observer,
		path: string[],
		value: any,
		original: any,
		dirty: [any, any],
		i = 0
	for (; i < l; i++) {
		subject = dirtyQueue[i]
		dirty = subject.__dirty
		value = dirty[0]
		original = dirty[1]

		subject.__dirty = null // clean dirty
		if (value !== original || !isPrimitive(value)) {
			owner = subject.__owner
			path = subject.__path
			subject.__listeners.each((fn, scope) => {
				scope ? fn.call(scope, path, value, original, owner) : fn(path, value, original, owner)

				//#if _DEBUG
				listens++
				//#endif
			})

			//#if _DEBUG
			subjects++
			//#endif
		}
	}

	//#if _DEBUG
	console.log(`notify changed subjects: x${subjects}/${l}, listeners: x${listens} use ${Date.now() - start}ms`)
	//#endif
}

export const OBSERVER_KEY = '__observer__'
export function getObserver(target: ObserverTarget) {
	const oserver: Observer = target[OBSERVER_KEY]
	if (oserver && (oserver.target === target || oserver.proxy === target)) return oserver
}
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
	 * subjects
	 * 	- key: property of original object
	 * 	- value: subject
	 */
	__subjects: { [key: string]: Subject }

	/**
	 * watched subjects
	 * 	- key: property of original object
	 * 	- value: subjects
	 */
	readonly __watchs: { [key: string]: List<Subject> }

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
	 * observe property
	 * @param propPath 	property path of original object, parse string path by {@link parsePath}
	 * @param listener	callback
	 * @param scope		scope of callback
	 */
	observe(propPath: string | string[], listener: ObserveListener, scope?: any) {
		const path: string[] = parsePath(propPath),
			subjects = this.__subjects || (this.__subjects = create(null)),
			prop0 = path[0]

		let subject = subjects[prop0] || (subjects[prop0] = new Subject(this, prop0)),
			i = 1,
			l = path.length

		subject.__bind(this)

		for (; i < l; i++) {
			subject = subject.__addSub(path[i])
		}

		return subject.__listen(path, listener, scope)
	}

	/**
	 * @param propPath	property path on object
	 * @param listener	listener
	 * @param scope		scope of listener
	 * @return >= 0: listener count on the property path of object
	 * 			 -1: no listener
	 */
	unobserve(propPath: string | string[], listener: ObserveListener, scope?: any) {
		const subject = this.__getSubject(parsePath(propPath))
		subject && subject.__unlisten(listener, scope)
	}

	unobserveId(propPath: string | string[], id: string) {
		const subject = this.__getSubject(parsePath(propPath))
		subject && subject.__unlistenId(id)
	}

	/**
	 *
	 * @param path
	 */
	private __getSubject(path: string[]) {
		const { __subjects: subjects } = this
		let subject: Subject
		if (subjects && (subject = subjects[path[0]])) {
			for (var i = 1, l = path.length; i < l; i++) {
				if (!(subject = subject.__getSub(path[i]))) break
			}
		}
		return subject
	}

	/**
	 * update property value and notify changes
	 * @param prop		property
	 * @param original	original value
	 */
	update(prop: string, original: any) {
		const subjects = this.__watchs[prop]
		if (subjects && subjects.size()) {
			subjects.each(subject => subject.__update(original))
		}
	}

	/**
	 * get or create observer
	 * @abstract
	 * @protected
	 */
	observerOf(target: any): Observer {
		return assert('abstruct')
	}

	/**
	 * watch subject
	 * @private
	 * @param subject
	 */
	__watch(subject: Subject) {
		const { __watchs: watchs } = this
		const { __prop: prop } = subject
		const subjects = watchs[prop] || (watchs[prop] = new List<Subject>())
		subjects.add(subject)
	}

	/**
	 * remove watched subject
	 * @private
	 * @param subject
	 */
	__unwatch(subject: Subject) {
		this.__watchs[subject.__prop].remove(subject)
	}

	/**
	 * get property value
	 * @private
	 * @param prop property
	 */
	__value(prop: string) {
		const { target } = this
		return this.isArray && prop === ARRAY_CHANGE_PROP ? target : target[prop]
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
const ARRAY_CHANGE_PROP = 'change',
	ARRAY_LENGTH_PROP = 'length',
	ARRAY_EVENTS = makeMap([ARRAY_CHANGE_PROP, ARRAY_LENGTH_PROP]),
	arrayHooks = mapArray(
		'fill,pop,push,reverse,shift,sort,splice,unshift'.split(','),
		(method: string): ArrayHook => {
			const fn = Array[PROTOTYPE][method]
			return [
				method,
				function() {
					const array: any[] = this,
						orgLen = array.length,
						rs: any = applyScope(fn, array, arguments),
						observer: Observer = array[OBSERVER_KEY]
					observer.update(ARRAY_CHANGE_PROP, array)
					if (orgLen !== array.length) observer.update(ARRAY_LENGTH_PROP, orgLen)
					return rs
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
 *                                     test subject                                     *
 *                                                                                      */
//========================================================================================
/*
const objIdGen: { [key: string]: number } = {}
function objId(obj: any, str: string) {
	return obj.id || (obj.id = str + '-' + (objIdGen[str] ? ++objIdGen[str] : (objIdGen[str] = 1)))
}
function subjectState(subject: Subject) {
	const path = []
	let p = subject
	while (p) {
		path.unshift(p.__prop)
		p = p.__parent
	}
	const subs = subject.__subs && subject.__subs.length
	const listeners = subject.__listeners && subject.__listeners.size()

	assert.is(!!(subs || listeners) === !!(subject.__flags & SUBJECT_ENABLED_FLAG))
	assert.is(!!subs === !!(subject.__flags & SUBJECT_SUB_FLAG))
	assert.is(!!listeners === !!(subject.__flags & SUBJECT_LISTEN_FLAG))
	assert.is(!subject.__observer || subject.__flags & SUBJECT_ENABLED_FLAG)

	return {
		id: objId(subject, 'subject'),
		path: formatPath(path),
		obj: JSON.stringify(subject.__owner.target),
		enabled: !!(subs || listeners),
		listeners: listeners,
		watched: subject.__observer && {
			id: objId(subject.__observer, 'observer'),
			obj: JSON.stringify(subject.__observer.target),
			watchs: watchs(subject.__observer)
		},
		subCache: subject.__subCache && map(subject.__subCache, subjectState),
		subs: subs && map(subject.__subs, sub => objId(sub, 'subject'))
	}
}
function observerState(observer: Observer) {
	return {
		id: objId(observer, 'observer'),
		obj: JSON.stringify(observer.target),
		watchs: watchs(observer),
		subjects: map(observer.__subjects, subj => subjectState(subj))
	}
}
function watchs(observer: Observer) {
	return map(observer.__watchs, w =>
		w
			.toArray()
			.map(s => objId(s, 'subject'))
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
obs.update('a', obs.target['a'], ov)

setTimeout(function() {
	logState(obs)
}, 1000)

logState(obs)
 */
