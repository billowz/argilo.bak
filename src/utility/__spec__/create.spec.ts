import expect from 'expect.js'
import { create } from '../create'
import { hasOwnProp } from '../prop'
import { protoOf } from '../proto'

describe('create', function() {
	it('create', () => {
		const o = { a: 1 },
			o2 = create(o)

		expect(o2.a).to.equal(1)
		expect(hasOwnProp(o2, 'a')).to.equal(false)
		expect(protoOf(o2)).to.equal(o)

		o2.a = 2
		expect(o.a).to.equal(1)
	})

	it('constructor', function() {
		const a = {}

		function A() {}

		function B() {}

		expect(a.constructor).to.equal(Object)
		expect(A.constructor).to.equal(Function)
		expect(B.constructor).to.equal(Function)
		expect(A.prototype.constructor).to.equal(A)
		expect(B.prototype.constructor).to.equal(B)
		expect(new A().constructor).to.equal(A)

		B.prototype = create(A.prototype)
		expect(B.prototype.constructor).to.equal(A)
		expect(new B().constructor).to.equal(A)

		B.prototype.constructor = B
		expect(new B().constructor).to.equal(B)
	})
})
