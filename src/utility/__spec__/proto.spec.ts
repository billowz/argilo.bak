import expect from 'expect.js'
import { protoOf, setProto } from '../proto'

describe('utility/proto', () => {
	it('protoOf', function() {
		expect(protoOf({})).to.equal(Object.prototype)
		expect(protoOf(new Object())).to.equal(Object.prototype)

		function A() {}

		expect(protoOf(A)).to.equal(Function.prototype)
		expect(protoOf(new A())).to.equal(A.prototype)
	})

	it('setProto', function() {
		const a = {},
			b = { a: 1 }

		function A() {}

		setProto(a, b)
		expect(protoOf(a)).to.equal(b)
		expect((a as any).a).to.equal(1)

		setProto(A, b)
		expect(protoOf(A)).to.equal(b)
		expect(protoOf(new A())).to.equal(A.prototype)
	})
})
