import expect from 'expect.js'
import { apply, applyN, applyNoScope, applyNoScopeN, applyScope, applyScopeN, createFn, fnName } from '../fn'

describe('utility/fn', function() {
	describe('bind', function() {
		it('bind scope')
		it('bind arguments')
		it('bind scope + arguments')
	})

	it('createFn', function() {
		function A() {}

		const fn1 = createFn(`return 1;`)
		const fn2 = createFn(`return 2;`, [], 'aaa')
		const fn3 = createFn(`return a + 2;`, ['a'])
		const fn4 = createFn(`return a +b+ 2;`, ['a', 'b'], 'bbb')

		expect(fn1()).to.equal(1)
		expect(fn2()).to.equal(2)
		expect(fn3(1)).to.equal(3)
		expect(fn4(1, 1)).to.equal(4)

		if (fnName(A) === 'A') {
			expect(fnName(fn2)).to.equal('aaa')
			expect(fnName(fn4)).to.equal('bbb')
		}
	})

	describe('apply', function() {
		function createApplyFunc(
			scope,
			args: number[],
			cb?: (fn: () => number, scope, args: number[]) => void
		): () => number {
			if (cb) {
				cb(applyFn, scope, args)
			}
			return applyFn
			function applyFn() {
				expect(Array.prototype.slice.call(arguments)).to.eql(args)
				if (scope === undefined || scope === null) {
					expect(!this || (typeof window !== 'undefined' && this === window) || this === global).to.equal(
						true
					)
				} else {
					expect(this).to.equal(scope)
				}
				let i = arguments.length,
					ret = 0
				while (i--) {
					ret += arguments[i]
				}
				return ret
			}
		}

		it('apply scope + arguments', function() {
			createApplyFunc({}, [1, 2], (fn, scope, args) => {
				expect(applyScope(fn, scope, args)).to.equal(3)
				expect(apply(fn, scope, args)).to.equal(3)
			})
			createApplyFunc(new Number(1), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (fn, scope, args) => {
				expect(applyScope(fn, scope, args)).to.equal(55)
				expect(apply(fn, scope, args)).to.equal(55)
			})
		})
		it('apply arguments', function() {
			createApplyFunc(undefined, [1, 2], (fn, scope, args) => {
				expect(applyNoScope(fn, args)).to.equal(3)
				expect(apply(fn, undefined, args)).to.equal(3)
				expect(apply(fn, null, args)).to.equal(3)
			})
			createApplyFunc(undefined, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (fn, scope, args) => {
				expect(applyNoScope(fn, args)).to.equal(55)
				expect(apply(fn, undefined, args)).to.equal(55)
				expect(apply(fn, null, args)).to.equal(55)
			})
		})
		it('apply scope + arguments with offset/length', function() {
			createApplyFunc(new String('abc'), [2, 3], (fn, scope) => {
				expect(applyScopeN(fn, scope, [1, 2, 3, 4], 1, 2)).to.equal(5)
				expect(applyN(fn, scope, [1, 2, 2, 3, 4, 5], 2, 2)).to.equal(5)
			})
			createApplyFunc(new Number(0), [2, 3, 4, 5, 6, 7, 8, 9], (fn, scope, args) => {
				expect(applyScopeN(fn, scope, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 8)).to.equal(44)
				expect(applyN(fn, scope, [2, 3, 4, 5, 6, 7, 8, 9, 10], 0, 8)).to.equal(44)
			})
		})
		it('apply arguments with offset/length', function() {
			createApplyFunc(undefined, [2, 3], (fn, scope, args) => {
				expect(applyNoScopeN(fn, [1, 2, 3, 4], 1, 2)).to.equal(5)
				expect(applyN(fn, undefined, [1, 2, 3, 4], 1, 2)).to.equal(5)
				expect(applyN(fn, null, [1, 2, 3, 4], 1, 2)).to.equal(5)
			})
			createApplyFunc(undefined, [2, 3, 4, 5, 6, 7, 8, 9], (fn, scope, args) => {
				expect(applyNoScopeN(fn, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 8)).to.equal(44)
				expect(applyN(fn, undefined, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 8)).to.equal(44)
				expect(applyN(fn, null, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 8)).to.equal(44)
			})
		})
	})
	describe('bind', function() {
		it('bind scope')
		it('bind arguments')
		it('bind scope + arguments')
	})
})
