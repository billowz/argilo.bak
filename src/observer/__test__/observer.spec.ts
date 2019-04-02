import {
	assert,
	create,
	isDefaultKey,
	assign,
	keys,
	eq,
	eachObj,
	mapObj,
	isFn,
	parsePath,
	nextTick,
	eachArray,
	formatPath,
	popErrStack,
	format
} from '../../utility'
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
	collect,
	ObserverTarget,
	MISS,
	ObserverCallback,
	observedId,
	unobserveId,
	observed
} from '../index'
import { isArray } from 'util'
import { each } from 'benchmark'

const vb = proxyEnable === 'vb',
	es6proxy = proxyEnable === 'proxy'

describe('observer', function() {
	it('default keys', function() {
		assert.is(isDefaultKey(OBSERVER_KEY))
		if (proxyEnable === 'vb') {
			assert.is(isDefaultKey(VBPROXY_KEY))
			assert.is(isDefaultKey(VBPROXY_CTOR_KEY))
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
			assert.not(getObserver(obj))

			const obs = observer(obj)
			assert.eq(obj, obs.target)
			assert.eq(source(obj), obs.target)
			assert.eq(proxy(obj), obs.proxy)
			assert.eq(obs, getObserver(obj))
			assert.eq(obs, observer(obj))

			assert.is($eq(obj, obs.target))
			assert.is($eq(obj, obs.proxy))
			if (proxyEnable) {
				assert.not(eq(obj, obs.proxy))
			}
			return obs
		}
	})

	it('observe changes on an object property', function(done) {
		new ObserveChain({
			name: 'Mary',
			email: 'mary@domain.com',
			age: 18
		})
			.step(
				(o, c) => {
					c.collect('name', 'email', 'age')
					o.name = 'Paul'
					o.email = 'paul@domain.com'
					o.age = 18
				},
				(w, c) => {
					c.expect({ name: ['Paul', 'Mary'], email: ['paul@domain.com', 'mary@domain.com'] })
				}
			)
			.step(
				(o, c) => {
					o.name = 'Mary'
					o.email = 'mary@domain.com'
					c.uncollect('email')
				},
				(w, c) => {
					c.expect({ name: ['Mary', 'Paul'] })
				}
			)
			.step(
				(o, c) => {
					c.uncollect()
					o.name = 'Paul'
					o.email = 'paul@domain.com'
					o.age = 20
				},
				(w, c) => {
					c.expect({})
				}
			)
			.run(done)
	})

	it('observe changes on an array property', function() {
		// const w = observeAll([1, 2, 3], {
		// 	'[0]': [[2, vb ? MISS : 1]],
		// 	'[1]': [[3, vb ? MISS : 2]],
		// 	length: [[4, MISS]],
		// 	$change: () => [w.obj, vb ? MISS : w.obj]
		// })
		// w.obj[0]++
		// w.obj[1]++
		// w.obj.push(1)
		// collect()
		// w.called({
		// 	'[0]': 1,
		// 	'[1]': 1,
		// 	length: 1,
		// 	$change: 1
		// })
		// collect()
		// w.called({})
		// w.unobserve()
		// collect()
		// w.called({})
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
			dirties: [any, any?][]
			listenId: string
		}
	}
	stepIdx: number
	steps: {
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
			setup?: (o: T, c: ObserveChain<T>) => void
			done?: (
				w: {
					[path: string]: [any, any]
				},
				c: ObserveChain<T>
			) => void
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

		if (stepIdx === steps.length) {
			done && done()
			return
		}

		console.log(`Running Step: ${stepIdx}`)

		const step = steps[stepIdx]

		step.setup && step.setup(this.ob.proxy, this)

		nextTick(() => {
			step.done && step.done(mapObj(this.ctxs, ctx => ctx.dirties[stepIdx]), this)

			console.log(`Finished Step: ${stepIdx}`)

			this.stepIdx++

			nextTick(() => this.run(done))
		})
	}
	collect(...paths: string[]): void
	collect() {
		eachArray(arguments, path => this.collectPath(path))
	}
	uncollect(...paths: string[]): void
	uncollect() {
		eachArray(arguments.length ? arguments : keys(this.ctxs), path => this.uncollectPath(path))
	}
	collectPath(path: string) {
		const { ob, ctxs, stepIdx } = this
		const o = __p__++ & 1 ? ob.target : ob.proxy,
			ctx =
				ctxs[path] ||
				(ctxs[path] = {
					called: 0,
					cb(path: string[], value: any, original: any, observer: IObserver<T>) {
						assert.eq(
							this,
							ctx,
							`[{d}][{}]: invalid context on observer callback: {j} expect to {j}`,
							stepIdx,
							ctx.path,
							this,
							ctx
						)
						assert.is(
							ctx.listenId,
							`[{d}][{}]: context is non-listened, context: {j}`,
							stepIdx,
							ctx.path,
							ctx
						)

						assert.eq(
							ob,
							observer,
							`[{d}][{}]: invalid observer on observer callback, context: {j}`,
							stepIdx,
							ctx.path,
							ctx
						)
						assert.eql(
							path,
							parsePath(ctx.path),
							`[{d}][{}]: invalid path[{}] on observer callback, context: {j}`,
							stepIdx,
							ctx.path,
							formatPath(path),
							ctx
						)
						assert.not(
							ctx.dirties[stepIdx],
							`[{d}][{}]: double notified observer callback, context: {j}`,
							stepIdx,
							ctx.path,
							ctx
						)
						ctx.dirties[stepIdx] = [value, original]
						ctx.called++

						console.log(
							format(
								`[{d}][{}]: collected dirty on observer callback, value: {j}, origin: {j}`,
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

			assert.is(observedId(o, path, ctx.listenId), `[{d}][{}]: observe failed, context: {j}`, stepIdx, path, ctx)
			assert.eq(
				ctx.listenId,
				ob.observed(path, ctx.cb, ctx),
				`[{d}][{}]: observe failed, context: {j}`,
				stepIdx,
				path,
				ctx
			)
			console.log(`[{d}][{}]: observe: {}`, stepIdx, path, ctx.listenId)
		}
	}
	uncollectPath(path: string) {
		const { ob, stepIdx } = this
		const o = __p__++ & 1 ? ob.target : ob.proxy,
			ctx = this.ctxs[path]

		if (ctx && ctx.listenId) {
			__p__++ & 1 ? this.ob.unobserve(path, ctx.cb, ctx) : unobserveId(o, path, ctx.listenId)

			assert.not(
				this.ob.observedId(path, ctx.listenId),
				`[{d}][{}]: unobserve failed, listen-id: {}, context: {j}`,
				stepIdx,
				path,
				ctx.listenId,
				ctx
			)

			assert.not(
				observed(o, path, ctx.cb, ctx),
				`[{d}][{}]: unobserve failed, listen-id: {}, context: {j}`,
				stepIdx,
				path,
				ctx.listenId,
				ctx
			)
			console.log(`[{d}][{}]: unobserved: {}`, stepIdx, path, ctx.listenId)
			ctx.listenId = null
		}
	}
	expect(expect: { [path: string]: [any, any?] } = {}) {
		const { stepIdx, ctxs } = this

		try {
			eachObj(expect, (e, path) => {
				const ctx = ctxs[path],
					d = ctx.dirties[stepIdx]
				if (e) {
					assert.is(
						d,
						'[{d}][{}]: miss the dirty, expect to value: {j}, origin: {j}',
						stepIdx,
						path,
						e[0],
						e[1]
					)
					assert.eq(d[0], e[0])
					assert.eq(e[0], d[0], '[{d}][{}]: expect dirty value: {j} to {j}', d[0], e[0])
					if (e.length > 1) assert.eq(e[1], d[1], '[{d}][{}]: expect origin value: {j} to {j}', d[1], e[1])
				}
			})

			eachObj(ctxs, (ctx, path) => {
				const e = ctxs[path],
					d = ctx.dirties[stepIdx]
				if (!e)
					assert.not(
						d,
						'[{d}][{}]: collected the dirty, value: {{[0]}j}, origin: {{[1]}j}',
						stepIdx,
						path,
						d,
						d
					)
			})
		} catch (e) {
			throw popErrStack(e, 3)
		}
		return this
	}
}
