import {
	observer,
	source,
	proxy,
	getObserver,
	IObserver,
	VBPROXY_KEY,
	VBPROXY_CTOR_KEY,
	OBSERVER_KEY,
	$eq,
	proxyEnable,
	observe,
	ObserverTarget,
	ObserverCallback,
	observedId,
	unobserveId,
	observed
} from '../index'
import { format } from '../../format'
import { parsePath, formatPath } from '../../path'
import { nextTick } from '../../nextTick'
import { create, isDKey, assign, keys, eq, eachObj, mapObj, eachArray } from '../../util'
import { assert, popErrStack } from '../../assert'

const vb = proxyEnable === 'vb',
	es6proxy = proxyEnable === 'proxy'

describe('observer', function() {
	it('default keys', function() {
		assert.is(isDKey(OBSERVER_KEY), `require Default Key: ${OBSERVER_KEY}`)
		if (proxyEnable === 'vb') {
			assert.is(isDKey(VBPROXY_KEY), `require Default Key: ${VBPROXY_KEY}`)
			assert.is(isDKey(VBPROXY_CTOR_KEY), `require Default Key: ${VBPROXY_CTOR_KEY}`)
		}
	})

	it('create observer', function() {
		const objObs = createObserver({})
		const cObs = createObserver(create(objObs.target))

		assert.notEq(objObs, cObs)

		assert.eq(keys(objObs.target).length, 0)
		assert.eq(keys(assign({}, objObs.target)).length, 0)
		assert.eq(keys(create(objObs.target)).length, 0)

		assert.eq(keys(objObs.proxy).length, 0)
		assert.eq(keys(assign({}, objObs.proxy)).length, 0)
		assert.eq(keys(create(objObs.proxy)).length, 0)

		createObserver([])

		class Cls {}
		createObserver(new Cls())

		function Ctor() {}
		createObserver(new Ctor())

		assert.throw(() => observer(1))
		assert.throw(() => observer(new Date()))

		const o = {}
		assert.eq(source(o), o)
		assert.eq(proxy(o), o)

		function createObserver<T extends ObserverTarget>(obj: T): IObserver<T> {
			assert.not(getObserver(obj), `got the observer on new unobservable object`)

			const obs = observer(obj)
			assert.eq(obj, obs.target)
			assert.eq(source(obj), obs.target)
			assert.eq(proxy(obj), obs.proxy)
			assert.eq(obs, getObserver(obj))
			assert.eq(obs, observer(obj))

			assert.is($eq(obj, obs.target))
			assert.is($eq(obj, obs.proxy))
			if (proxyEnable && (es6proxy || !obs.isArray)) {
				assert.notEq(obj, obs.proxy)
			}
			return obs
		}
	})

	interface SimpleObject {
		name: string
		email: string
		age: number
	}
	const SimpleObjectName = 'Mary',
		SimpleObjectEmail = 'mary@domain.com',
		SimpleObjectAge = 18

	function observeSimpleObject(o: SimpleObject, done: () => void) {
		new ObserveChain(o, [
			{
				setup(o, c) {
					c.collect('name', 'email', 'age')
					o.name = 'Paul'
					o.email = 'paul@domain.com'
					o.age = 15
					o.age = 18
				},
				done(w, c) {
					c.expect({ name: ['Paul', 'Mary'], email: ['paul@domain.com', 'mary@domain.com'] })
				}
			},
			{
				setup(o, c) {
					o.name = 'Mary2'
					o.name = 'Mary'
					o.email = 'mary@domain.com'
					c.uncollect('email')
				},
				done(w, c) {
					c.expect({ name: ['Mary', 'Paul'] })
				}
			},
			{
				setup(o, c) {
					c.uncollect()
					o.name = 'Paul'
					o.email = 'paul@domain.com'
					o.age = 20
				},
				done(w, c) {
					c.expect({})

					o.name = SimpleObjectName
					o.email = SimpleObjectEmail
					o.age = SimpleObjectAge
				}
			}
		]).run(done)
	}
	it('observe changes on an literal object', function(done) {
		observeSimpleObject(
			{
				name: SimpleObjectName,
				email: SimpleObjectEmail,
				age: SimpleObjectAge
			},
			done
		)
	})

	it('observe changes on an instance of class', function(done) {
		class A {
			public name: string = SimpleObjectName
			public email: string
			constructor(email: string) {
				this.email = email
			}
		}
		class B extends A {
			public age: number
			constructor(age: number) {
				super(SimpleObjectEmail)
				this.age = age
			}
		}
		observeSimpleObject(new B(SimpleObjectAge), done)
	})

	it('observe changes on an instance of constructor', function(done) {
		function A(email: string) {
			this.email = email
		}
		A.prototype.name = SimpleObjectName

		function B(age: number) {
			A.call(this, SimpleObjectEmail)
			this.age = age
		}
		B.prototype = create(A.prototype)
		observeSimpleObject(new B(SimpleObjectAge), done)
	})

	it('observe changes on an sub-object', function(done) {
		const o = {
			name: SimpleObjectName,
			email: SimpleObjectEmail,
			age: SimpleObjectAge
		}
		observeSimpleObject(o, () => {
			const o2 = create(o, {
				name: { value: SimpleObjectName, writable: true, enumerable: true, configurable: true },
				email: { value: SimpleObjectEmail, writable: true, enumerable: true, configurable: true },
				age: { value: SimpleObjectAge, writable: true, enumerable: true, configurable: true }
			})
			observeSimpleObject(o2, () => {
				observeSimpleObject(create(o2), done)
			})
		})
	})

	it('observe changes on an array property', function(done) {
		new ObserveChain(
			[1],
			[
				{
					// [2]
					name: 'set index',
					setup(o, c) {
						c.collect('[0]', 'length', '$change')
						o[0]++
					},
					done(w, c) {
						c.expect(
							vb
								? {}
								: {
										'[0]': [2, 1],
										$change: [c.ob.proxy, c.ob.proxy]
								  }
						)
					}
				},
				{
					// [2,1]
					name: 'array.push',
					setup(o, c) {
						o.push(1)
					},
					done(w, c) {
						c.expect({
							length: [2, 1],
							$change: [c.ob.proxy, c.ob.proxy]
						})
					}
				},
				{
					// [3,2,1]
					name: 'array.unshift',
					setup(o, c) {
						o.unshift(3)
					},
					done(w, c) {
						c.expect({
							'[0]': [3, 2],
							length: [3, 2],
							$change: [c.ob.proxy, c.ob.proxy]
						})
					}
				},
				{
					// [4,2,1]
					name: 'array.splice 0',
					setup(o, c) {
						o.splice(0, 1, 4)
					},
					done(w, c) {
						c.expect({
							'[0]': [4, 3],
							$change: [c.ob.proxy, c.ob.proxy]
						})
					}
				},
				{
					// [4,3,2,1]
					name: 'array.splice 1',
					setup(o, c) {
						o.splice(1, 0, 3)
					},
					done(w, c) {
						c.expect({
							length: [4, 3],
							$change: [c.ob.proxy, c.ob.proxy]
						})
					}
				},
				{
					// [3,2,1]
					name: 'array.splice -1',
					setup(o, c) {
						o.splice(0, 1)
					},
					done(w, c) {
						c.expect({
							length: [3, 4],
							$change: [c.ob.proxy, c.ob.proxy]
						})
					}
				},
				{
					// [3,2]
					name: 'array.pop',
					setup(o, c) {
						o.pop()
					},
					done(w, c) {
						c.expect({
							length: [2, 3],
							$change: [c.ob.proxy, c.ob.proxy]
						})
					}
				},
				{
					// [2]
					name: 'array.shift',
					setup(o, c) {
						o.shift()
					},
					done(w, c) {
						c.expect({
							length: [1, 2],
							$change: [c.ob.proxy, c.ob.proxy]
						})
					}
				},
				{
					// [2,3,4,5]
					name: 'set out index',
					setup(o, c) {
						o[1] = 3
						o[2] = 4
						o[3] = 5
					},
					done(w, c) {
						c.expect(
							es6proxy
								? {
										length: [4, 1],
										$change: [c.ob.proxy, c.ob.proxy]
								  }
								: {}
						)
					}
				},
				{
					// [5,4,3,2]
					name: 'array.sort',
					setup(o, c) {
						o.sort((a, b) => b - a)
					},
					done(w, c) {
						c.expect({
							'[0]': [5, 2],
							$change: [c.ob.proxy, c.ob.proxy]
						})
					}
				},
				[].reverse && {
					// [2,3,4,5]
					name: 'array.reverse',
					setup(o, c) {
						o.reverse()
					},
					done(w, c) {
						c.expect({
							'[0]': [2, 5],
							$change: [c.ob.proxy, c.ob.proxy]
						})
					}
				},
				[].fill && {
					// [0,0,0,0]
					name: 'array.fill',
					setup(o, c) {
						o.fill(0)
					},
					done(w, c) {
						c.expect({
							'[0]': [0, 2],
							$change: [c.ob.proxy, c.ob.proxy]
						})
					}
				}
			]
		).run(done)
	})

	it('observe & unobserve', function() {
		const cb1 = () => {}
		const obj = { simple: 1, complex: {}, array: [{}, 0, 'string'] }
		obj.array[0] = obj

		const objObs = observer(obj)
		objObs.observe('simple', cb1)
	})

	function watch(obj: any) {}
})

let __p__ = 0
class ObserveChain<T extends ObserverTarget> {
	ob: IObserver<T>
	ctxs: {
		[path: string]: {
			called: number
			cb: ObserverCallback<T>
			path: string
			dirties: [any, any][]
			listenId: string
		}
	}
	stepIdx: number
	steps: {
		name?: string
		setup?: (o: T, c: ObserveChain<T>) => void
		done?: (
			w: {
				[path: string]: [any, any]
			},
			c: ObserveChain<T>
		) => void
	}[]

	constructor(
		o: T,
		steps?: {
			name?: string
			setup?: (o: T, c: ObserveChain<T>) => void
			done?: (
				w: {
					[path: string]: [any, any]
				},
				c: ObserveChain<T>
			) => void
			[key: string]: any
		}[]
	) {
		this.ob = observer(o)
		this.stepIdx = 0
		this.ctxs = {}
		this.steps = steps || []
	}

	step(
		setup: (o: T, c: ObserveChain<T>) => void,
		done?: (
			w: {
				[path: string]: [any, any]
			},
			c: ObserveChain<T>
		) => void
	) {
		this.steps.push({ setup, done })
		return this
	}

	run(done: () => void) {
		const { steps, stepIdx } = this

		if (stepIdx >= steps.length) {
			done && done()
			return
		}

		const step = steps[stepIdx]
		if (step) {
			step.setup && step.setup(this.ob.proxy, this)

			setTimeout(() => {
				step.done && step.done(mapObj(this.ctxs, ctx => ctx.dirties[stepIdx]), this)

				this.stepIdx++

				this.run(done)
			}, 20)
		} else {
			this.stepIdx++
			this.run(done)
		}
	}
	collect(...paths: string[]): void
	collect() {
		eachArray(arguments, path => this.collectPath(path))
	}
	uncollect(...paths: string[]): void
	uncollect() {
		eachArray(arguments.length ? arguments : keys(this.ctxs), path => this.uncollectPath(path))
	}
	stepLabel() {
		const { stepIdx } = this
		const step = this.steps[stepIdx]
		return step && step.name ? stepIdx + ': ' + step.name : stepIdx
	}
	collectPath(path: string) {
		const chain = this
		const { ob, ctxs } = this
		const o = __p__++ & 1 ? ob.target : ob.proxy,
			ctx =
				ctxs[path] ||
				(ctxs[path] = {
					called: 0,
					cb(path: string[], value: any, original: any, observer: IObserver<T>) {
						const stepIdx = chain.stepLabel()
						assert.eq(
							this,
							ctx,
							`[{d}][{}]: invalid context on observer callback: {0j} expect to {1j}`,
							stepIdx,
							ctx.path
						)
						assert.is(
							ctx.listenId,
							`[{d}][{}]: observer callback is not listened, listen-id: {0}`,
							stepIdx,
							ctx.path
						)

						assert.eq(ob, observer, `[{d}][{}]: invalid observer on observer callback`, stepIdx, ctx.path)
						assert.eql(
							path,
							parsePath(ctx.path),
							`[{d}][{}]: invalid path[{}] on observer callback`,
							stepIdx,
							ctx.path,
							formatPath(path)
						)
						assert.not(
							ctx.dirties[stepIdx],
							`[{d}][{}]: double notified observer callback`,
							stepIdx,
							ctx.path
						)
						ctx.dirties[stepIdx] = [value, original]
						ctx.called++

						console.log(
							format(
								`[{d}][{}]: collected dirty, value: {j}, origin: {j}`,
								stepIdx,
								ctx.path,
								value,
								original
							)
						)
					},
					path,
					dirties: [],
					listenId: null
				})

		if (!ctx.listenId) {
			ctx.listenId = __p__++ & 1 ? observe(o, path, ctx.cb, ctx) : ob.observe(path, ctx.cb, ctx)

			const stepIdx = this.stepLabel()
			assert.is(
				observedId(o, path, ctx.listenId),
				`[{d}][{}]: observe failed, listen-id: {}`,
				stepIdx,
				path,
				ctx.listenId
			)
			assert.eq(
				ctx.listenId,
				ob.observed(path, ctx.cb, ctx),
				`[{d}][{}]: observe failed, listen-id: {0}`,
				stepIdx,
				path
			)

			console.log(format(`[{d}][{}]: observe: {}`, stepIdx, path, ctx.listenId))
		}
	}
	uncollectPath(path: string) {
		const { ob } = this
		const o = __p__++ & 1 ? ob.target : ob.proxy,
			ctx = this.ctxs[path]

		if (ctx && ctx.listenId) {
			const stepIdx = this.stepLabel()

			assert.is(
				observedId(o, path, ctx.listenId),
				`[{d}][{}]: un-listened, listen-id: {}`,
				stepIdx,
				path,
				ctx.listenId
			)
			assert.eq(
				ctx.listenId,
				ob.observed(path, ctx.cb, ctx),
				`[{d}][{}]: un-listened, listen-id: {0}`,
				stepIdx,
				path
			)
			__p__++ & 1 ? this.ob.unobserve(path, ctx.cb, ctx) : unobserveId(o, path, ctx.listenId)

			assert.not(
				this.ob.observedId(path, ctx.listenId),
				`[{d}][{}]: unobserve failed, listen-id: {}`,
				stepIdx,
				path,
				ctx.listenId
			)

			assert.not(
				observed(o, path, ctx.cb, ctx),
				`[{d}][{}]: unobserve failed, listen-id: {}`,
				stepIdx,
				path,
				ctx.listenId
			)
			console.log(format(`[{d}][{}]: unobserved: {}`, stepIdx, path, ctx.listenId))
			ctx.listenId = null
		}
	}
	expect(expect: { [path: string]: [any, any?] }) {
		const { ctxs } = this
		const stepIdx = this.stepLabel()
		expect = expect || {}
		try {
			eachObj(expect, (e, path) => {
				const ctx = ctxs[path],
					d = ctx.dirties[stepIdx]
				if (e) {
					assert.is(
						d,
						'[{d}][{}]: miss the dirty, expect to value: {{[0]}j}, origin: {@{[1]}j}',
						stepIdx,
						path,
						e
					)
					assert.eq(d[0], e[0], '[{d}][{}]: expect dirty value: {0j} to {1j}', stepIdx, path)
					if (e.length > 1)
						assert.eq(d[1], e[1], '[{d}][{}]: expect origin value: {0j} to {1j}', stepIdx, path)
				}
			})

			eachObj(ctxs, (ctx, path) => {
				const e = ctxs[path],
					d = ctx.dirties[stepIdx]
				if (!e)
					assert.not(d, '[{d}][{}]: collected the dirty, value: {0{[0]}j}, origin: {0{[1]}j}', stepIdx, path)
			})
		} catch (e) {
			throw popErrStack(e, 3)
		}
		return this
	}
}
