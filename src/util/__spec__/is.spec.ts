import { GLOBAL } from '../consts'
import {
	is,
	isArray,
	isArrayLike,
	isBlank,
	isBoolean,
	isDate,
	isFn,
	isInt,
	isNil,
	isNumber,
	isObj,
	isPrimitive,
	isReg,
	isString,
	isNull,
	isUndef,
	eq
} from '../is'
import { assert } from '../../assert'

function getArgs(...args: any[]): IArguments
function getArgs(): IArguments {
	return arguments
}

const typeTests = {
	isNull: {
		is: isNull,
		vals: [null]
	},
	isUndf: {
		is: isUndef,
		vals: [undefined]
	},
	isFn: {
		is: isFn,
		vals: [function() {}, new Function('return true;'), Object, Function, Array, Number]
	},
	isBoolean: {
		is: isBoolean,
		type: Boolean,
		vals: [true, false, new Boolean(true), new Boolean(false)]
	},
	isNumber: {
		is: isNumber,
		type: Number,
		vals: [0, -1, 1, 0.1, NaN, Infinity, -Infinity, 1 / 0, -1 / 0, new Number(1)]
	},
	isString: {
		is: isString,
		type: String,
		vals: ['', '0', '1', 'true', 'false', 'undefined', 'null', new String('')]
	},
	isObj: {
		is: isObj,
		type: Object,
		vals: [{}, { a: 1 }, new Object(), create({}), create(null)]
	},
	isDate: {
		is: isDate,
		type: Date,
		vals: [new Date()]
	},
	isReg: {
		is: isReg,
		type: RegExp,
		vals: [/^1/, new RegExp('^1')]
	},
	isArray: {
		is: isArray,
		type: Array,
		vals: [new Array(0), []]
	}
}

const isTests = {
	isInt: {
		is: isInt,
		vals: [0.0, -1.0, 1.0],
		ivals: [true, false, undefined, 0.1, 1 / 0, -1 / 0, NaN, {}, function() {}]
	},
	isPrimitive: {
		is: isPrimitive,
		vals: [true, false, 1, -0.1, NaN, '', 'abc', function() {}, undefined, null],
		ivals: [{}, [], new String(), new Boolean(true), new Number(1), /^1/]
	},
	isArrayLike: {
		is: isArrayLike,
		vals: [
			new Array(0),
			[],
			new Array(10),
			[1, 2, 3],
			'',
			'   ',
			'123',
			getArgs(1, 2, 3),
			{ length: 0 },
			{ length: 10, '9': undefined }
		].concat(GLOBAL.Int8Array ? [new Int8Array(0)] : []),
		ivals: [1, { length: 10 }, {}]
	},
	isBlank: {
		is: isBlank,
		vals: ['', '     ', [], new Array(0), getArgs(), { length: 0 }, null, undefined, 0, false].concat(
			GLOBAL.Int8Array ? [new Int8Array(0)] : []
		),
		ivals: ['a', getArgs(undefined), 1, true, [1], new Array(1), {}].concat(
			GLOBAL.Int8Array ? [new Int8Array(1)] : []
		)
	},
	isNil: {
		is: isNil,
		vals: [undefined, null],
		ivals: [0, false, '']
	}
}

describe('util/is', () => {
	each(typeTests, function(test, name) {
		it(name as string, function() {
			each(test.vals, function(v, i) {
				assert.eq(test.is(v), true)
			})
			each(typeTests, function(t) {
				if (t !== test) {
					each(t.vals, function(v, i) {
						assert.eq(test.is(v), false)
					})
				}
			})
		})
	})
	each(isTests, function(test, name) {
		/**
		 * @test {isNull}
		 * @test {isBool}
		 */
		it(name as string, function() {
			each(test.vals, function(v, i) {
				assert.eq(test.is(v), true)
			})
			each(test.ivals, function(v, i) {
				assert.eq(test.is(v), false)
			})
		})
	})

	if (GLOBAL.document) {
		/**
		 * @test {isArrayLike}
		 */
		it('isArrayLike: dom collection', function() {
			assert.eq(isArrayLike(document.body.children), true)
			assert.eq(isArrayLike(document.body.childNodes), true)
		})
	}

	/**
	 * @test {is}
	 */
	it('is', function() {
		each(typeTests, function(test, name) {
			if (test.type) {
				each(test.vals, function(v, i) {
					assert.eq(is(v, test.type), true)
				})
				each(typeTests, function(t) {
					if (t !== test) {
						each(t.vals, function(v, i) {
							assert.eq(is(v, test.type), false)
						})
					}
				})
			}
		})
		assert.eq(is(true, [Boolean, Number, String, Date]), true)
		assert.eq(is(1, [Boolean, Number, String, Date]), true)
		assert.eq(is('1', [Boolean, Number, String, Date]), true)
		assert.eq(is(new Date(), [Boolean, Number, String, Date]), true)
		assert.eq(is({}, [Boolean, Number, String, Date]), false)
		assert.eq(is(/^1/, [Boolean, Number, String, Date]), false)
	})

	/**
	 * @test {eq}
	 */
	it('eq', function() {
		assert.eq(eq(NaN, NaN), true)
		assert.eq(eq(0, null), false)
		assert.eq(eq(1, '1'), false)
	})
})

function each(o: any, cb: (v: any, i: number | string) => void) {
	if (o instanceof Array) {
		for (var i = 0, l = o.length; i < l; i++) {
			cb(o[i], i)
		}
	} else {
		for (var k in o) {
			if (Object.prototype.hasOwnProperty.call(o, k)) {
				cb(o[k], k)
			}
		}
	}
}
function create(o: object): object {
	function __() {}
	__.prototype = o
	return new __()
}
