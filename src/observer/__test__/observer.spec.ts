import { assert, create, hasOwnProp, isDefaultKey, assign, keys, eq } from '../../utility'
import '../index'
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
	MISS
} from '../index'

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

	it('Observe changes on an object property', function() {
		const ob = observer({
				name: 'Mary',
				email: 'mary@domain.com',
				age: 18
			}),
			o = ob.proxy

		const listeners = [
			assert.executor((prop, newvalue, oldvalue, _ob) => {
				assert.eql(prop, ['name'])
				assert.eq(newvalue, 'Paul')
				assert.eq(oldvalue, 'Mary')
				assert.eq(_ob, ob)
			}, 1),
			assert.executor((prop, newvalue, oldvalue, _ob) => {
				assert.eql(prop, ['email'])
				assert.eq(newvalue, 'paul@domain.com')
				assert.eq(oldvalue, 'mary@domain.com')
				assert.eq(_ob, ob)
			}, 1)
		]

		observe(o, 'name', listeners[0])
		observe(o, 'name', listeners[0])
		observe(o, 'email', listeners[1])
		observe(o, 'age', assert.executor(() => {}, 0))

		o.name = 'Paul'
		o.email = 'paul@domain.com'
		o.age = 18
		collect()
		assert.eq(listeners[0].called, 1)
		assert.eq(listeners[1].called, 1)
	})

	it('Observe changes on an array property', function() {
		const ob = observer([1, 2, 3]),
			o = ob.proxy

		const listeners = [
			assert.executor((prop, newvalue, oldvalue, _ob) => {
				assert.eql(prop, ['0'])
				assert.eq(newvalue, 2)
				if (proxyEnable !== 'vb') assert.eq(oldvalue, 1)
				assert.eq(_ob, ob)
			}, 1),
			assert.executor((prop, newvalue, oldvalue, _ob) => {
				assert.eql(prop, ['1'])
				assert.eq(newvalue, 3)
				if (proxyEnable !== 'vb') assert.eq(oldvalue, 2)
				assert.eq(_ob, ob)
			}, 1),
			assert.executor((prop, newvalue, oldvalue, _ob) => {
				assert.eql(prop, ['length'])
				assert.eq(newvalue, 4)
				assert.eq(oldvalue, MISS)
				assert.eq(_ob, ob)
			}, 1),
			assert.executor((prop, newvalue, oldvalue, _ob) => {
				assert.eql(prop, ['$change'])
				assert.eq(newvalue, o)
				assert.eq(oldvalue, proxyEnable === 'vb' ? MISS : o)
				assert.eq(_ob, ob)
			}, 1)
		]

		observe(o, '[0]', listeners[0])
		observe(o, '[1]', listeners[1])
		observe(o, 'length', listeners[2])
		observe(o, '$change', listeners[3])

		o[0]++
		o[1]++
		o.push(1)

		collect()
		assert.eq(listeners[0].called, 1)
		assert.eq(listeners[1].called, 1)
		assert.eq(listeners[2].called, 1)
		assert.eq(listeners[3].called, 1)
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
