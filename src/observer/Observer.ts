/**
 * @module observer
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Dec 26 2018 13:59:10 GMT+0800 (China Standard Time)
 * @modified Wed Feb 27 2019 13:12:54 GMT+0800 (China Standard Time)
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
	map,
	isNil
} from '../utility'
import { PROTOTYPE } from '../utility/consts'
import { assert } from '../utility/assert'

export type ObserverTarget = any[] | {}

export type ObserveListener = (path: string[], value: any, original: any, observer: Observer) => void

function checkObserverTarget(obj: any) {
	return (obj && isArray(obj)) || isObj(obj)
}
const dirtyQueue: Subject[] = [],
	notifyQueue: Subject[] = []

const SUBJECT_DIRTY_FLAG = 0x1,
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

	__dirty: [any, any]

	__notifyDirty: [any, any]

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

	private __initSubObserver(): Observer {
		const { __observer: observer, __prop: prop } = this
		if (observer) {
			const target = observer.target[prop]

			if (checkObserverTarget(target)) {
				var subObserver: Observer = target[OBSERVER_KEY]
				if (!subObserver || !(subObserver.target === target || subObserver.proxy === target)) {
					subObserver = observer.observerOf(target)
				}
				if (subObserver.proxy !== target) {
					observer.target[prop] = subObserver.proxy
				}
				return subObserver
			} else if (!isNil(target)) {
			}
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

	private __badArrayPath(i: number, msg?: string) {
		const path = this.__getPath()
		console.error(
			`bad path[{}]: not support {} on Array{}{}.`,
			formatPath(path),
			formatPath(path.slice(-i)),
			path.length > i ? `[${formatPath(path.slice(0, -i))}]` : '',
			msg || '',
			this.__owner.target
		)
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
					this.__badArrayPath(1, ', change to "change" or "length"')
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
	 * create or get sub-subject on cache
	 * @param subProp	property
	 * @param binded	binded observer
	 */
	__addSub(subProp: string): Subject {
		// get or init cache and subs
		const subCache = this.__subCache || ((this.__subs = []), (this.__subCache = create(null))),
			// get or create sub-subject on cache
			sub = subCache[subProp] || (subCache[subProp] = new Subject(this.__owner, subProp, this))

		if (!(sub.__flags & SUBJECT_ENABLED_FLAG)) {
			const { __subs: subs } = this
			// attach sub-subject
			sub.__flags |= SUBJECT_ENABLED_FLAG
			subs.push(sub)

			const { __observer: observer } = this
			if (observer) {
				if (observer.isArray) {
					sub.__badArrayPath(2)
				} else {
					sub.__bind(subs[0] ? subs[0].__observer : this.__initSubObserver())
				}
			}
		}

		this.__flags |= SUBJECT_SUB_FLAG | SUBJECT_ENABLED_FLAG

		return sub
	}

	/**
	 * add listener
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

	/**
	 * check subject state
	 */
	____unlisten(listeners: FnList<ObserveListener>) {
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
	 * remove listener
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
	 */
	__unlistenId(id: string) {
		const { __listeners: listeners } = this
		if (listeners) {
			listeners.removeId(id)
			this.____unlisten(listeners)
		}
	}

	__collect(dirty: [any, any]) {
		const { __flags: flags } = this

		if (flags & SUBJECT_LISTEN_FLAG) {
			!this.__notifyDirty && notifyQueue.push(this)
			this.__notifyDirty = dirty
		}

		if (flags & SUBJECT_SUB_FLAG) {
			const { __subs: subs } = this
			const l = subs.length,
				subObserver: Observer = this.__initSubObserver()

			subObserver && (dirty[0] = subObserver.proxy)

			for (var i = 0; i < l; i++) {
				subs[i].__collectDep(subObserver, dirty[0])
			}
		}
	}

	__collectDep(observer: Observer, value: any) {
		const { __observer: org } = this
		if (org !== observer) {
			const { __prop: prop } = this
			var { __dirty: dirty } = this

			this.__bind(observer)

			if (dirty) {
				this.__dirty = null
			} else {
				dirty = this.__notifyDirty || [, org && org.__value(prop)]
			}
			dirty[0] = observer ? observer.__value(prop) : isNil(value) ? undefined : value[prop]
			this.__collect(dirty)
		}
	}

	/**
	 * notify change
	 * @param value
	 * @param original
	 */
	__notify(value: any, original: any) {
		const { __dirty: dirty } = this
		if (dirty) {
			dirty[0] = value
		} else {
			this.__dirty = [value, original]
			const l = dirtyQueue.length
			dirtyQueue[l] = this
			!l && nextTick(notify)
		}
	}
	__getPath() {
		let path: string[] = this.__path
		if (!path) {
			const { __parent: parent, __prop: prop } = this
			this.__path = path = parent ? parent.__getPath().concat(prop) : [prop]
		}
		return path
	}
}

function notify() {
	//#if _DEBUG
	let start = Date.now()
	//#endif

	// collect dirty subjects
	let subject: Subject,
		l = dirtyQueue.length,
		i = 0,
		dirty: [any, any]
	for (; i < l; i++) {
		subject = dirtyQueue[i]
		if ((dirty = subject.__dirty)) {
			subject.__collect(dirty)
			subject.__dirty = null
		}
	}

	//#if _DEBUG
	console.log(`collect observed subjects: x${notifyQueue.length} use ${Date.now() - start}ms`)
	let changed = 0,
		listens = 0
	start = Date.now()
	//#endif

	// notify subject listeners
	let owner: Observer, path: string[], value: any, original: any
	l = notifyQueue.length
	i = 0
	for (; i < l; i++) {
		subject = notifyQueue[i]
		dirty = subject.__notifyDirty
		value = dirty[0]
		original = dirty[1]
		subject.__notifyDirty = null
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
			changed++
			//#endif
		}
	}
	//#if _DEBUG
	console.log(`notify changed subjects: x${changed}/${l}, listeners: x${listens} use ${Date.now() - start}ms`)
	//#endif
}

export const OBSERVER_KEY = '__observer__'
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
	 * @param value		new value
	 * @param original	original value
	 */
	update(prop: string, value: any, original: any) {
		const subjects = this.__watchs[prop]
		if (subjects && subjects.size()) {
			subjects.each(subject => subject.__notify(value, original))
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
						len = array.length,
						rs: any = applyScope(fn, array, arguments),
						newlen = array.length,
						observer: Observer = array[OBSERVER_KEY]
					observer.update(ARRAY_CHANGE_PROP, array, array)
					if (len !== newlen) observer.update(ARRAY_LENGTH_PROP, newlen, len)
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
