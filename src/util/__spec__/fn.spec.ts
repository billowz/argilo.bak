import { apply, applyN, applyNoScope, applyNoScopeN, applyScope, applyScopeN, createFn, fnName } from '../fn'
import { assert } from '../../assert'

describe('util/fn', function() {
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

		assert.eq(fn1(), 1)
		assert.eq(fn2(), 2)
		assert.eq(fn3(1), 3)
		assert.eq(fn4(1, 1), 4)

		if (fnName(A) === 'A') {
			assert.eq(fnName(fn2), 'aaa')
			assert.eq(fnName(fn4), 'bbb')
		}
	})

	describe('apply', function() {
		function createApplyFunc(
			scope: any,
			args: number[],
			cb?: (fn: () => number, scope: any, args: number[]) => void
		): () => number {
			if (cb) {
				cb(applyFn, scope, args)
			}
			return applyFn
			function applyFn() {
				assert.eql(Array.prototype.slice.call(arguments), args)
				if (scope === undefined || scope === null) {
					assert.eq(!this || (typeof window !== 'undefined' && this === window) || this === global, true)
				} else {
					assert.eq(this, scope)
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
				assert.eq(applyScope(fn, scope, args), 3)
				assert.eq(apply(fn, scope, args), 3)
			})
			createApplyFunc(new Number(1), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (fn, scope, args) => {
				assert.eq(applyScope(fn, scope, args), 55)
				assert.eq(apply(fn, scope, args), 55)
			})
		})
		it('apply arguments', function() {
			createApplyFunc(undefined, [1, 2], (fn, scope, args) => {
				assert.eq(applyNoScope(fn, args), 3)
				assert.eq(apply(fn, undefined, args), 3)
				assert.eq(apply(fn, null, args), 3)
			})
			createApplyFunc(undefined, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (fn, scope, args) => {
				assert.eq(applyNoScope(fn, args), 55)
				assert.eq(apply(fn, undefined, args), 55)
				assert.eq(apply(fn, null, args), 55)
			})
		})
		it('apply scope + arguments with offset/length', function() {
			createApplyFunc(new String('abc'), [2, 3], (fn, scope) => {
				assert.eq(applyScopeN(fn, scope, [1, 2, 3, 4], 1, 2), 5)
				assert.eq(applyN(fn, scope, [1, 2, 2, 3, 4, 5], 2, 2), 5)
			})
			createApplyFunc(new Number(0), [2, 3, 4, 5, 6, 7, 8, 9], (fn, scope, args) => {
				assert.eq(applyScopeN(fn, scope, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 8), 44)
				assert.eq(applyN(fn, scope, [2, 3, 4, 5, 6, 7, 8, 9, 10], 0, 8), 44)
			})
		})
		it('apply arguments with offset/length', function() {
			createApplyFunc(undefined, [2, 3], (fn, scope, args) => {
				assert.eq(applyNoScopeN(fn, [1, 2, 3, 4], 1, 2), 5)
				assert.eq(applyN(fn, undefined, [1, 2, 3, 4], 1, 2), 5)
				assert.eq(applyN(fn, null, [1, 2, 3, 4], 1, 2), 5)
			})
			createApplyFunc(undefined, [2, 3, 4, 5, 6, 7, 8, 9], (fn, scope, args) => {
				assert.eq(applyNoScopeN(fn, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 8), 44)
				assert.eq(applyN(fn, undefined, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 8), 44)
				assert.eq(applyN(fn, null, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 8), 44)
			})
		})
	})
})
