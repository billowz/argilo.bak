import { protoOf, setProto } from '../proto'
import { assert } from '../../assert'

describe('util/proto', () => {
	it('protoOf', function() {
		assert.eq(protoOf({}), Object.prototype)
		assert.eq(protoOf(new Object()), Object.prototype)

		function A() {}

		assert.eq(protoOf(A), Function.prototype)
		assert.eq(protoOf(new A()), A.prototype)
	})

	it('setProto', function() {
		const a = {},
			b = { a: 1 }

		function A() {}

		setProto(a, b)
		assert.eq(protoOf(a), b)
		assert.eq((a as any).a, 1)

		setProto(A, b)
		assert.eq(protoOf(A), b)
		assert.eq(protoOf(new A()), A.prototype)
	})
})
