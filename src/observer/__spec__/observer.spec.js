import { assert, exception, info, debug, warn } from 'devlevel'
import { observer, observe, unobserve, isObserved, $eq, $set as set, $hasOwnProp, source, proxy } from '../index'
import { get, nextTick, parsePath, formatPath } from '../../common'
import { isPrimitive, hasOwnProp } from '../../helper'

describe('Observer', () => {
	it('observer', () => {
		let obj = {},
			obs = observer(obj)
		expect(obs).to.equal(observer(obj))
		expect(obj).to.equal(obs.source)
		expect(source(obj)).to.equal(obs.source)
		expect(proxy(obj)).to.equal(obs.proxy)
		let obj2 = {}
		expect(source(obj2)).to.equal(obj2)
		expect(proxy(obj2)).to.equal(obj2)
	})

	it('$hasOwnProp', () => {
		expect($hasOwnProp({}, 'a')).to.equal(false)
		expect(
			$hasOwnProp(
				{
					a: 1
				},
				'a'
			)
		).to.equal(true)
		expect($hasOwnProp(observer({}).proxy, 'a')).to.equal(false)
		expect(
			$hasOwnProp(
				observer({
					a: 1
				}).proxy,
				'a'
			)
		).to.equal(true)
	})

	it('$eq', () => {
		expect($eq({}, {})).to.equal(false)
		let obs = observer({})
		expect($eq(obs.source, obs.proxy)).to.equal(true)
	})

	it('get & set', () => {
		let o = {
			a: {
				b: [1, 2, 3]
			}
		}
		expect(get(o, 'a.b[0]')).to.equal(1)
		expect(get(o, 'a.b[1]')).to.equal(2)

		set(o, 'a.b[0]', 2)
		expect(o.a.b[0]).to.equal(2)
		expect(get(o, 'a.b[0]')).to.equal(2)
	})

	it('observe attribute', function(done) {
		const obj = {},
			arr = [],
			arr2 = []
		runCase(
			{},
			[
				{
					a: 1
				},
				{
					a: 1
				},
				{
					a: 'a'
				},
				{
					a: undefined
				},
				{
					a: null
				},
				{
					a: false
				},
				{
					a: new Date()
				},
				{
					a: arr
				},
				{
					a: arr
				},
				{
					a: arr2
				},
				{
					a: obj
				},
				{
					a: obj
				},
				{
					a: undefined
				}
			],
			done,
			this.test.title
		)
	})
	it('observe array', function(done) {
		let arr = []
		runCase(
			arr,
			[
				{
					change: arr,
					setter(o) {
						o.push(1)
					}
				},
				{
					length: 2,
					setter(o) {
						o.push(2)
					}
				},
				{
					change: arr,
					length: 4,
					setter(o) {
						o.splice(0, 0, 3, 4)
					}
				}
			],
			done,
			this.test.title
		)
	})
	it('observe path', function(done) {
		const obj = {},
			arr = []
		runCase(
			{},
			[
				{
					'a.b': 1
				},
				{
					'a.b': 'a'
				},
				{
					'a.b': undefined
				},
				{
					'a.b': undefined,
					setter(obj) {
						obj.a = undefined
					}
				},
				{
					'a.b': null
				},
				{
					'a.b': undefined,
					setter(obj) {
						obj.a = undefined
					}
				},
				{
					'a.b': false
				},
				{
					'a.b': new Date()
				},
				{
					'a.b': arr
				},
				{
					'a.b': arr
				},
				{
					'a.b.length': 1,
					'a.b.change': arr,
					setter(o) {
						o.a.b.push(1)
					}
				},
				{
					'a.b': obj,
					'a.b.length': undefined,
					setter(o) {
						o.a.b = obj
					}
				},
				{
					'a.b': obj
				},
				{
					'a.b': arr,
					setter(o) {
						o.a = {
							b: arr
						}
					}
				},
				{
					'a.b': obj,
					setter(o) {
						o.a = {
							b: obj
						}
					}
				},
				{
					'a.b.c': 1
				},
				{
					'a.b.c': 4,
					setter(o) {
						o.a = {
							b: {
								c: 2
							}
						}
						o.a.b = {
							c: 3
						}
						o.a.b.c = 4
					}
				},
				{
					'a.b.c': 7,
					setter(o) {
						o.a.b.c = 5
						o.a.b = {
							c: 6
						}
						o.a = {
							b: {
								c: 7
							}
						}
					}
				},
				{
					'a.b.c': 7,
					setter(o) {
						o.a.b.c = 8
						o.a.b = {
							c: 9
						}
						o.a = {
							b: {
								c: 7
							}
						}
					}
				}
			],
			done,
			this.test.title
		)
	})
})

function runCase(obj, changes, done, title) {
	let step = 0,
		observed = {}

	function next() {
		if (!changes[++step]) {
			for (var path in observed) {
				if (observed[path] > 0) {
					unobserve(obj, path, checkCall)
					expect(isObserved(obj, path, checkCall)).equal(false)
				}
			}
			done()
		} else {
			nextTick(runStep)
		}
	}

	let timeout

	function getValue(obj, path) {
		path = parsePath(path)
		if (path[path.length - 1] === 'change') path = path.slice(0, path.length - 1)
		return path.length ? get(obj, path) : obj
	}

	function setValue(obj, path, value) {
		path = parsePath(path)
		if (path[path.length - 1] === 'change') path = path.slice(0, path.length - 1)
		set(obj, path, value)
	}

	let listens = {}

	function runStep() {
		function eachChange(cb) {
			for (let path in change) {
				if (hasOwnProp(change, path) && path !== 'setter') {
					cb(path, change[path])
				}
			}
		}

		listens = {}

		let change = changes[step],
			descs = []
		descs.event = 0

		// bind listeners
		eachChange((userPath, after) => {
			let path = formatPath(parsePath(userPath)),
				before = getValue(obj, path),
				desc = {
					descs: descs,
					path: path,
					userPath: userPath,
					before: before,
					after: after,
					event: !(before === after && isPrimitive(after)),
					complete: 0
				}
			desc.cb = callback.bind(null, desc)
			descs.push(desc)
			if (desc.event) descs.event++
			debug('%s - Step[%d]: observing path[%s]: "%s" => "%s"', title, step, path, before, after)

			// bind call check
			obj = observe(obj, path, checkCall)
			expect(isObserved(obj, path, checkCall)).equal(true)
			observed[path] = (observed[path] || 0) + 1

			// bind valid
			obj = observe(obj, path, desc.cb)
			expect(isObserved(obj, path, desc.cb)).equal(true)
			if (!hasOwnProp(listens, path))
				listens[path] = {
					nr: 0,
					called: 0
				}
			listens[path].nr++
		})

		// do change
		if (change.setter) {
			info('%s - Step[%d]: change by setter', title, step)
			change.setter(obj)
		} else {
			for (var i = 0; i < descs.length; i++) {
				var desc = descs[i]
				if (descs.length > 1) {
					info(
						'%s - Step[%d][%d/%d]: change path[%s]: "%s" => "%s"',
						title,
						step,
						i + 1,
						descs.length,
						desc.path,
						desc.before,
						desc.after
					)
				} else {
					info(
						'%s - Step[%d]: change path[%s]: "%s" => "%s"',
						title,
						step,
						desc.path,
						desc.before,
						desc.after
					)
				}
				setValue(obj, desc.path, desc.after)
			}
		}

		function timeoutCheckor(step, recheck, isRecheck) {
			return function() {
				debug('%s - Step[%d]: %schecking timeout', title, step, isRecheck ? 're-' : '')
				for (let i = 0, desc; i < descs.length; i++) {
					desc = descs[i]
					if (desc.event) {
						if (!desc.complete) {
							if (recheck) {
								timeout = setTimeout(timeoutCheckor(step, 0, true), recheck)
								return
							}
							exception(
								`${title} - Step[${step}]: not watched change event on path[${desc.path}]: "${
									desc.before
								}" => "${desc.after}"`
							)
						}
						assert(
							desc.complete === 1,
							`${title} - Step[${step}]: multi watched change event on path[${desc.path}]: "${
								desc.before
							}" => "${desc.after}"`
						)
					} else if (!desc.complete) {
						desc.complete = true
						info(
							'%s - %cStep[%d]: non-event change path[%s]: "%s"',
							title,
							'color:blue;',
							step,
							desc.path,
							desc.after
						)
					}
				}
				// clean callback
				for (let i = 0, desc; i < descs.length; i++) {
					desc = descs[i]
					debug(
						'%s - Step[%d]: unobserve path[%s]: "%s" => "%s"',
						title,
						step,
						desc.path,
						desc.before,
						desc.after
					)
					unobserve(obj, desc.path, desc.cb)
					expect(isObserved(obj, desc.path, desc.cb)).equal(false)

					if (!--observed[desc.path]) {
						unobserve(obj, desc.path, checkCall)
						expect(isObserved(obj, desc.path, checkCall)).equal(false)
					}
				}
				debug('%s - Step[%d]: finish\n', title, step)
				next()
			}
		}
		// timeout check
		timeout = setTimeout(timeoutCheckor(step, 20), 20)
	}

	function callback(desc, path, val, oldVal, obs) {
		path = formatPath(path)

		info('%s - %cStep[%d]: watched path[%s]: "%s" => "%s"', title, 'color:red;', step, path, oldVal, val)

		desc.complete++
		expect(desc.complete).equal(1)
		expect(path).equal(desc.path)
		expect(desc.event).equal(true)
		expect(val === oldVal && isPrimitive(val)).equal(false)
		expect($eq(oldVal, desc.before)).to.equal(true)
		expect($eq(getValue(obj, path), val)).to.equal(true)
		expect($eq(desc.after, val)).to.equal(true)
	}

	function checkCall(path, val, oldVal) {
		path = formatPath(path)
		if (listens[path]) {
			++listens[path].called
			assert(
				listens[path].called === listens[path].nr,
				`${title} - Step[${step}]: multi watched change event on path[${path}]: "${oldVal}" => "${val}"`
			)
		} else {
			warn('%s - %cStep[%d]: non-watched path[%s]: "%s" => "%s"', title, 'color:red;', step, path, oldVal, val)
		}
	}
	runStep()
}
