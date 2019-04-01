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
	formatPath
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
		observeChain(
			{
				name: 'Mary',
				email: 'mary@domain.com',
				age: 18
			},
			[
				{
					setup(o, c) {
						c.collect('name', 'email', 'age')
						o.name = 'Paul'
						o.email = 'paul@domain.com'
						o.age = 18
					},
					done(w, c) {
						assert.eql(w, {
							name: ['Paul', 'Mary'],
							email: ['paul@domain.com', 'mary@domain.com'],
							age: undefined
						})
					}
				}
			],
			done
		)

		// const w = observeAll(
		// 	{
		// 		name: 'Mary',
		// 		email: 'mary@domain.com',
		// 		age: 18
		// 	},
		// 	{
		// 		name: [['Paul', 'Mary'], ['Paul', 'Test']],
		// 		email: [['paul@domain.com', 'mary@domain.com']],
		// 		age: () => {}
		// 	}
		// )

		// w.obj.name = 'Paul'
		// w.obj.email = 'paul@domain.com'
		// w.obj.age = 18

		// nextTick(() => {
		// 	w.called({
		// 		name: 1,
		// 		email: 1
		// 	})

		// 	w.obj.name = 'Test'
		// 	w.obj.email = 'test@domain.com'

		// 	w.unobserve(['email'])

		// 	nextTick(() => {
		// 		w.called({ name: 1 })

		// 		w.obj.name = 'Test2'

		// 		w.unobserve()

		// 		nextTick(() => {
		// 			w.called({})
		// 			done()
		// 		})
		// 	})
		// })
	})

	it('observe changes on an array property', function() {
		const w = observeAll([1, 2, 3], {
			'[0]': [[2, vb ? MISS : 1]],
			'[1]': [[3, vb ? MISS : 2]],
			length: [[4, MISS]],
			$change: () => [w.obj, vb ? MISS : w.obj]
		})

		w.obj[0]++
		w.obj[1]++
		w.obj.push(1)

		collect()

		w.called({
			'[0]': 1,
			'[1]': 1,
			length: 1,
			$change: 1
		})

		collect()
		w.called({})
		w.unobserve()

		collect()
		w.called({})
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

type ObserveChain<T> = {
	ob: IObserver<T>
	ctxs: {
		[path: string]: {
			path: string
			dirties: [any, any][]
			called: number
			cb: ObserverCallback<T>
			listenId: string
		}
	}
	collect(...paths: string[]): void
	uncollect(...paths: string[]): void
}
let num = 0
function observeChain<T extends ObserverTarget>(
	o: T,
	steps: {
		setup?: (o: T, c: ObserveChain<T>) => void
		done?: (
			w: {
				[path: string]: [any, any]
			},
			c: ObserveChain<T>
		) => void
	}[],
	done?: () => void
) {
	const l = steps.length
	let i = 0
	const ob = observer(o)
	const chain: ObserveChain<T> = {
		ob,
		ctxs: {},
		collect() {
			eachArray(arguments, path => watchPath(path))
		},
		uncollect() {
			eachArray(arguments, path => unwatchPath(path))
		}
	}
	next()

	function unwatchPath(path: string) {
		const ctx = chain[path]
		if (ctx && ctx.listenId) {
			if (num++ & 1) {
				ob.unobserve(path, ctx.cb, ctx)
			} else {
				unobserveId(o, path, ctx.listenId)
			}

			assert.not(
				ob.observedId(path, ctx.listenId),
				`[{d}][{}]: unobserve failed, listen-id: {}, context: {j}`,
				i,
				path,
				ctx.listenId,
				ctx
			)

			assert.not(
				observed(o, path, ctx.cb, ctx),
				`[{d}][{}]: unobserve failed, listen-id: {}, context: {j}`,
				i,
				path,
				ctx.listenId,
				ctx
			)
			ctx.listenId = null
		}
	}

	function watchPath(path: string) {
		const ctx =
			chain.ctxs[path] ||
			(chain.ctxs[path] = {
				called: 0,
				cb,
				path,
				dirties: [],
				listenId: null
			})
		if (!ctx.listenId) {
			ctx.listenId = num++ & 1 ? observe(o, path, cb, ctx) : ob.observe(path, cb, ctx)

			assert.is(observedId(o, path, ctx.listenId), `[{d}][{}]: observe failed, context: {j}`, i, path, ctx)
			assert.eq(ctx.listenId, ob.observed(path, cb, ctx), `[{d}][{}]: observe failed, context: {j}`, i, path, ctx)
		}

		function cb(path: string[], value: any, original: any, observer: IObserver<T>) {
			assert.eq(
				this,
				ctx,
				`[{d}][{}]: invalid context on observer callback, {j} expect {j}`,
				i,
				ctx.path,
				this,
				ctx
			)
			assert.is(ctx.listenId, `[{d}][{}]: context is non-listened, context: {j}`, i, ctx.path, ctx)

			assert.eq(ob, observer, `[{d}][{}]: invalid observer on observer callback, context: {j}`, i, ctx.path, ctx)
			assert.eql(
				path,
				parsePath(ctx.path),
				`[{d}][{}]: invalid path[{}] on observer callback, context: {j}`,
				i,
				ctx.path,
				formatPath(path),
				ctx
			)
			assert.not(ctx.dirties[i], `[{d}][{}]: double notified observer callback, context: {j}`, i, ctx.path, ctx)
			ctx.dirties[i] = [value, original]
			ctx.called++
		}
	}

	function next() {
		if (i === l) {
			done && done()
			return
		}
		const step = steps[i]

		step.setup && step.setup(ob.proxy, chain)

		nextTick(() => {
			step.done && step.done(mapObj(chain.ctxs, ctx => ctx.dirties[i]), chain)
			i++
			next()
		})
	}
}

let i = 0
function observeAll<T extends ObserverTarget>(
	o: T,
	watchs: {
		[path: string]:
			| [any, any?][]
			| ((path: string[], value: any, original: any, observer: IObserver<T>) => [any, any?] | void)
			| {
					cb?: (path: string[], value: any, original: any, observer: IObserver<T>) => [any, any?] | void
					expect?: [any, any?][]
					scope: any
			  }
	}
) {
	const ob = observer(o)
	const ctxs = mapObj(watchs, (w, p) => {
		let cb: (path: string[], value: any, original: any, observer: IObserver<T>) => [any, any?] | void,
			scope: any,
			expect: [any, any?][]
		if (isFn(w)) {
			cb = w
		} else if (isArray(w)) {
			expect = w as [any, any?]
		} else {
			cb = w.cb
			scope = w.scope
			expect = w.expect
		}

		const ctx = {
			obj: o,
			ob,
			path: parsePath(p),
			strPath: p,
			cb,
			expect,
			scope,
			listenId: '',
			ocalled: 0,
			called: 0,
			executor(path: any[], newvalue: any, oldvalue: any, ob: IObserver<T>) {
				assert.eq(this, ctx, `invalid context {j}, expect {j}`, this, ctx)

				assert.is(ctx.listenId, `context is not listened, context: {j}`, ctx)

				assert.eq(ctx.ob, ob, `invalid observer on observer callback, context: {j}`, ctx)
				assert.eql(path, ctx.path, `observer callback path: {j}, expect {j}, context: {j}`, path, ctx.path, ctx)

				let expect = ctx.expect && ctx.expect[ctx.called]
				ctx.called++
				if (expect) {
					expectValue(expect, newvalue, oldvalue, ctx)
				} else if (!ctx.cb) {
					assert(`bad test, no callback or export on {d} call, context: {j}`, ctx.called, ctx)
				}
				if (ctx.cb) {
					expect = ctx.cb.call(ctx.scope || ctx, path, newvalue, oldvalue, ob)
					if (expect) expectValue(expect, newvalue, oldvalue, ctx)
				}

				console.debug(
					`observer notified x${ctx.called} changes at ${ctx.strPath} of context ${JSON.stringify(ctx)}`
				)
			}
		}
		if (i++ & 1) {
			ctx.listenId = ob.observe(p, ctx.executor, ctx)
		} else {
			ctx.listenId = observe(o, p, ctx.executor, ctx)
		}
		assert.eq(
			ctx.listenId,
			ob.observed(p, ctx.executor, ctx),
			`observe failed, listen-id: {}, context: {j}`,
			ctx.listenId,
			ctx
		)
		assert.is(observedId(o, p, ctx.listenId), `observe failed, listen-id: {}, context: {j}`, ctx.listenId, ctx)
		return ctx
	})
	function expectValue(expect: [any, any?], newvalue: any, oldvalue: any, ctx: any) {
		assert.eq(newvalue, expect[0], `observer notify value: {j}, expect {j}, context: {j}`, newvalue, expect[0], ctx)
		expect.length > 1 &&
			assert.eq(
				oldvalue,
				expect[1],
				`observer notify origin value: {j}, expect {j}, context: {j}`,
				oldvalue,
				expect[1],
				ctx
			)
	}
	return {
		obj: ob.proxy,
		originObj: o,
		ob,
		called(nrs: { [path: string]: number } = {}) {
			eachObj(nrs, (nr, p) => {
				const ctx = ctxs[p]
				assert.is(ctx, `bad test, not define callback on {}`, p)
				assert.eq(
					ctx.called - ctx.ocalled,
					nr,
					`observer callback called: {d}, expect {d}, context: {j}`,
					ctx.called - ctx.ocalled,
					nr,
					ctx
				)
			})
			eachObj(ctxs, ctx => {
				if (!nrs[ctx.strPath]) {
					assert.eq(
						ctx.called,
						ctx.ocalled,
						`observer callback is called and not check, origin called: {d}, called: {d}, context: {j}`,
						ctx.ocalled,
						ctx.called,
						ctx
					)
				}
				ctx.ocalled = ctx.called
			})
		},
		unobserve(paths?: string[]) {
			paths = paths || keys(ctxs)
			each(paths, (p: string) => {
				const ctx = ctxs[p]
				assert.is(ctx, `bad test, not define callback on {}`, p)
				if (ctx.listenId) {
					if (i++ & 1) {
						ctx.ob.unobserve(ctx.strPath, ctx.executor, ctx)
					} else {
						unobserveId(ctx.obj, ctx.path, ctx.listenId)
					}

					assert.not(
						ob.observedId(p, ctx.listenId),
						`unobserve failed, listen-id: {}, context: {j}`,
						ctx.listenId,
						ctx
					)

					assert.not(
						observed(o, p, ctx.executor, ctx),
						`unobserve failed, listen-id: {}, context: {j}`,
						ctx.listenId,
						ctx
					)
					ctx.listenId = null
				}
			})
		}
	}
}
