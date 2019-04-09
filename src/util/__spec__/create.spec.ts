import { create } from '../create'
import { hasOwnProp } from '../ownProp'
import { protoOf } from '../proto'
import { assert } from '../../assert'

describe('util/create', function() {
	it('create', () => {
		const o = { a: 1 },
			o2 = create(o)

		assert.eq(o2.a, 1)
		assert.eq(hasOwnProp(o2, 'a'), false)
		assert.eq(protoOf(o2), o)

		o2.a = 2
		assert.eq(o.a, 1)
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
