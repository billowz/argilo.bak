import { doAssign, assign, assignIf } from '../assign'
import { assert } from '../../assert'

describe('util/assign', function() {
	it('doAssign')

	it('assign', function() {
		// assign source properties
		assert.eql(assign({ a: 1 }, { b: 2 }), { a: 1, b: 2 })

		// assign multiple sources
		assert.eql(assign({ a: 1 }, { b: 2 }, { c: 3 }), { a: 1, b: 2, c: 3 })
		assert.eql(assign({ a: 1 }, { b: 1 }, { b: 2, c: 3 }), { a: 1, b: 2, c: 3 })

		// overwrite destination properties
		assert.eql(assign({ a: 1, b: 2 }, { a: 3, b: 2, c: 1 }), { a: 3, b: 2, c: 1 })

		// assign source properties with nullish values
		assert.eql(assign({ a: 1, b: 2 }, { a: null, b: undefined, c: null }), { a: null, b: undefined, c: null })

		// assign array source
		assert.eql(assign({}, [1, , 3]), { '0': 1, '2': 3 })

		// assign values of prototype objects
		function Foo() {}
		Foo.prototype.a = 1
		assert.eql(assign({}, Foo.prototype), { a: 1 })

		// assign without prototype properties
		assert.eql(assign({}, new Foo()), {})
	})
	it('assignIf', function() {
		// assignIf source properties
		assert.eql(assignIf({ a: 1 }, { b: 2 }), { a: 1, b: 2 })

		// assignIf multiple sources
		assert.eql(assignIf({ a: 1 }, { b: 2 }, { c: 3 }), { a: 1, b: 2, c: 3 })
		assert.eql(assignIf({ a: 1 }, { b: 2 }, { b: 1, c: 3 }), { a: 1, b: 2, c: 3 })

		// ignore destination properties
		assert.eql(assignIf({ a: 1, b: 2 }, { a: 3, b: 2, c: 1 }), { a: 1, b: 2, c: 1 })

		// assignIf source properties with nullish values
		assert.eql(assignIf({ a: 1 }, { a: null, b: undefined, c: null }), { a: 1, b: undefined, c: null })

		// assignIf array source
		assert.eql(assignIf({}, [1, , 3]), { '0': 1, '2': 3 })

		// assignIf values of prototype objects
		function Foo() {}
		Foo.prototype.a = 1
		assert.eql(assignIf({}, Foo.prototype), { a: 1 })

		// assignIf without prototype properties
		assert.eql(assignIf({}, new Foo()), {})
	})
})
