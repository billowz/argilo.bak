import { create } from '../create'
import { hasOwnProp } from '../ownProp'
import { protoOf } from '../proto'
import { assert } from '../../assert'
import { defValue, defAccessor, propDescriptor, propAccessor } from '../defProp'
import { T_UNDEF } from '../consts'
import { DKeyMap } from '../dkeys'

function keys(o: any): string[] {
	const keys = []
	for (var k in o) {
		if (!DKeyMap[k]) keys.push(k)
	}
	keys.sort()
	return keys
}
describe('util/create', function() {
	it('create', () => {
		const o = { name: 'Mary' },
			o2 = create(o)

		assert.eql(o, { name: 'Mary' })
		assert.eql(o2, { name: 'Mary' })

		assert.eq(protoOf(o2), o)
		assert.not(hasOwnProp(o2, 'name'))

		assert.eql(keys(o2), ['name'])

		// set name on o2
		o2.name = 'Tony'
		assert.is(hasOwnProp(o2, 'name'))

		assert.eql(o, { name: 'Mary' })
		assert.eql(o2, { name: 'Tony' })

		// add property
		o2.email = 'tony@domain.com'

		assert.eql(o, { name: 'Mary' })
		assert.eql(o2, { name: 'Tony', email: 'tony@domain.com' })

		assert.eql(keys(o2), ['email', 'name'])
	})

	it('create with property descriptor', () => {
		const o = { name: 'Mary' },
			o2 = create(o, { name: { value: 'Tony', enumerable: true, writable: true, configurable: false } })

		assert.eql(o, { name: 'Mary' })
		assert.eql(o2, { name: 'Tony' })

		assert.eq(protoOf(o2), o)
		assert.is(hasOwnProp(o2, 'name'))

		assert.eql(keys(o2), ['name'])

		// add property
		o2.email = 'tony@domain.com'

		assert.eql(o, { name: 'Mary' })
		assert.eql(o2, { name: 'Tony', email: 'tony@domain.com' })

		assert.eql(keys(o2), ['email', 'name'])
	})

	propAccessor &&
		it('create on accessor property', () => {
			const o = {}
			defValue(o, 'name', 'Mary', true, false)

			var email = 'mary@domain.com'
			defAccessor(o, 'email', () => email, v => (email = v), true, false)

			const o2 = create(o)

			assert.eql(o, { name: 'Mary', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Mary', email: 'mary@domain.com' })

			assert.eq(protoOf(o2), o)
			assert.not(hasOwnProp(o2, 'name'))
			assert.not(hasOwnProp(o2, 'email'))

			assert.eql(keys(o2), ['email', 'name'])

			// set name on o2
			o2.name = 'Tony'
			assert.is(hasOwnProp(o2, 'name'))

			// set email on o and o2 (well set email by o's accessor)
			o2.email = 'tony@domain.com'
			assert.not(hasOwnProp(o2, 'email'))

			assert.eql(o, { name: 'Mary', email: 'tony@domain.com' })
			assert.eql(o2, { name: 'Tony', email: 'tony@domain.com' })

			// set email on o and o2 (well set email by o's accessor)
			o2.email = 'mary@domain.com'
			assert.not(hasOwnProp(o2, 'email'))
			assert.eql(o, { name: 'Mary', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Tony', email: 'mary@domain.com' })

			// config email on o2
			defValue(o2, 'email', 'tony@domain.com')
			assert.is(hasOwnProp(o2, 'email'))

			assert.eql(o, { name: 'Mary', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Tony', email: 'tony@domain.com' })

			// set name and email on o2
			o2.name = 'Paul'
			o2.email = 'paul@domain.com'

			assert.eql(o, { name: 'Mary', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Paul', email: 'paul@domain.com' })

			assert.eql(keys(o2), ['email', 'name'])

			// add property
			o2.age = 18
			defValue(o2, 'gender', 'man')

			assert.eql(o, { name: 'Mary', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Paul', email: 'paul@domain.com', age: 18, gender: 'man' })

			assert.eql(keys(o2), ['age', 'email', 'gender', 'name'])
		})

	propAccessor &&
		it('create with property descriptors on accessor property', () => {
			const o = {}
			defValue(o, 'name', 'Mary', true, false)

			var email = 'mary@domain.com'
			defAccessor(o, 'email', () => email, v => (email = v), true, false)

			const o2 = create(o, {
				name: { value: 'Paul', enumerable: true, writable: true, configurable: false },
				email: { value: 'paul@domain.com', enumerable: true, writable: true, configurable: true }
			})

			assert.eql(o, { name: 'Mary', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Paul', email: 'paul@domain.com' })

			assert.eq(protoOf(o2), o)
			assert.is(hasOwnProp(o2, 'name'))
			assert.is(hasOwnProp(o2, 'email'))

			assert.eql(keys(o2), ['email', 'name'])

			// set name and email on o2
			o2.name = 'Tony'
			o2.email = 'tony@domain.com'

			assert.eql(o, { name: 'Mary', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Tony', email: 'tony@domain.com' })

			// write and config property
			o2.name = 'Paul'
			defValue(o2, 'email', 'paul@domain.com')
			assert.eql(o, { name: 'Mary', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Paul', email: 'paul@domain.com' })

			// add property
			o2.age = 18
			defValue(o2, 'gender', 'man')

			assert.eql(o, { name: 'Mary', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Paul', email: 'paul@domain.com', age: 18, gender: 'man' })

			assert.eql(keys(o2), ['age', 'email', 'gender', 'name'])
		})

	typeof Proxy !== T_UNDEF &&
		it('create with proxy target', () => {
			const o = new Proxy(
				{
					name: 'Mary',
					email: 'mary@domain.com'
				},
				{
					set(o, p, v) {
						o[p] = v
						return true
					}
				}
			)
			const o2 = create(o)

			assert.eql(o, { name: 'Mary', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Mary', email: 'mary@domain.com' })

			assert.eq(protoOf(o2), o)
			assert.not(hasOwnProp(o2, 'name'))
			assert.not(hasOwnProp(o2, 'email'))

			assert.eql(keys(o2), ['email', 'name'])

			// set name on o2 and o (well set name by o's setter)
			o2.name = 'Tony'
			assert.not(hasOwnProp(o2, 'name'))

			// config email on o2
			var email = 'tony@domain.com'
			defAccessor(o2, 'email', () => email, v => (email = v), true, false)
			assert.is(hasOwnProp(o2, 'email'))

			assert.eql(o, { name: 'Tony', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Tony', email: 'tony@domain.com' })

			o2.name = 'Mary'
			assert.eql(o, { name: 'Mary', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Mary', email: 'tony@domain.com' })

			// config name on o2
			defValue(o2, 'name', 'Tony')
			assert.is(hasOwnProp(o2, 'name'))

			assert.eql(o, { name: 'Mary', email: 'mary@domain.com' })
			assert.eql(o2, { name: 'Tony', email: 'tony@domain.com' })

			// add age property on o2 and o (well set age by o's setter)
			o2.age = 18
			// add gender property on o2
			defValue(o2, 'gender', 'man')

			assert.eql(o, { name: 'Mary', email: 'mary@domain.com', age: 18 })
			assert.eql(o2, { name: 'Tony', email: 'tony@domain.com', age: 18, gender: 'man' })

			assert.eql(keys(o), ['age', 'email', 'name'])
			assert.eql(keys(o2), ['age', 'email', 'gender', 'name'])
		})

	it('constructor', function() {
		const a = {}

		function A() {}

		function B() {}

		assert.eq(a.constructor, Object)
		assert.eq(A.constructor, Function)
		assert.eq(B.constructor, Function)
		assert.eq(A.prototype.constructor, A)
		assert.eq(B.prototype.constructor, B)
		assert.eq(new A().constructor, A)

		B.prototype = create(A.prototype)
		assert.eq(B.prototype.constructor, A)
		assert.eq(new B().constructor, A)

		B.prototype.constructor = B
		assert.eq(new B().constructor, B)
	})
})
