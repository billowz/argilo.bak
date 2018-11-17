// @flow

import { apply, applyScope, applyNoScope, applyN, applyScopeN, applyNoScopeN, createFn } from '../fn'

const global = (function() {
	return this
})()

function checkScope(scope, target) {
	expect(scope).to.equal(target)
}

function checkArgs(args, target) {
	expect(Array.prototype.slice.call(args)).to.eql(target)
}

describe('Function', () => {
	it('applyScope', () => {
		const scope = {},
			args = [1, 2],
			ret = 3

		function fn(a, b) {
			checkScope(this, scope)
			checkArgs(arguments, args)
			return a + b
		}
		expect(apply(fn, scope, args)).to.equal(ret)
		expect(applyScope(fn, scope, args)).to.equal(ret)
	})
	it('applyNoScope', () => {
		const args = [1, 2],
			ret = 3

		function fn(a, b) {
			checkScope(this, global)
			checkArgs(arguments, args)
			return a + b
		}
		expect(apply(fn, undefined, args)).to.equal(ret)
		expect(apply(fn, null, args)).to.equal(ret)
		expect(applyNoScope(fn, args)).to.equal(ret)
	})
	it('applyScopeN', () => {
		const scope = {},
			args = [1, 2, 3, 4, 5],
			offset = 1,
			len = 2,
			ret = 2 + 3

		function fn(a, b) {
			checkScope(this, scope)
			checkArgs(arguments, args.slice(offset, offset + len))
			return a + b
		}
		expect(applyN(fn, scope, args, offset, len)).to.equal(ret)
		expect(applyScopeN(fn, scope, args, offset, len)).to.equal(ret)
	})
	it('applyNoScopeN', () => {
		const args = [1, 2, 3, 4, 5],
			offset = 1,
			len = 2,
			ret = 2 + 3

		function fn(a, b) {
			checkScope(this, global)
			checkArgs(arguments, args.slice(offset, offset + len))
			return a + b
		}
		expect(applyN(fn, undefined, args, offset, len)).to.equal(ret)
		expect(applyN(fn, null, args, offset, len)).to.equal(ret)
		expect(applyNoScopeN(fn, args, offset, len)).to.equal(ret)
	})
	it('createFunction', () => {
		function A() {}

		const fn1 = createFn(`return 1;`)
		const fn2 = createFn(`return 2;`, [], 'aaa')
		const fn3 = createFn(`return a + 2;`, ['a'])
		const fn4 = createFn(`return a +b+ 2;`, ['a', 'b'], 'bbb')

		expect(fn1()).to.equal(1)
		expect(fn2()).to.equal(2)
		expect(fn3(1)).to.equal(3)
		expect(fn4(1, 1)).to.equal(4)

		if (A.name === 'A') {
			expect(fn2.name).to.equal('aaa')
			expect(fn4.name).to.equal('bbb')
		}
	})
})
