// @flow
import {
	is,
	isNil,
	isFn,
	isBool,
	isNum,
	isInt,
	isStr,
	isDate,
	isReg,
	isObj,
	isArray,
	isPrimitive,
	isArrayLike,
	isBlank
} from '../is'
import create from '../create'
import { each } from '../collection'

function getArgs() {
	return arguments
}
const global = (function() {
	return this
})()
const typeTests = {
	nil: {
		is: isNil,
		vals: [undefined, null]
	},
	function: {
		is: isFn,
		vals: [function() {}, new Function('return true;'), Object, Function, Array]
	},
	boolean: {
		is: isBool,
		type: Boolean,
		vals: [true, false, new Boolean(true), new Boolean(false)]
	},
	number: {
		is: isNum,
		type: Number,
		vals: [0, -1, 1, 0.1, NaN, Infinity, -Infinity, 1 / 0, -1 / 0, new Number(1)]
	},
	string: {
		is: isStr,
		type: String,
		vals: ['', '0', '1', 'true', 'false', 'undefined', 'null', new String('')]
	},
	object: {
		is: isObj,
		type: Object,
		vals: [{}, new Object(), {}, create({}), create(null)]
	},
	date: {
		is: isDate,
		type: Date,
		vals: [new Date()]
	},
	regexp: {
		is: isReg,
		type: RegExp,
		vals: [/^1/, new RegExp('^1')]
	},
	array: {
		is: isArray,
		type: Array,
		vals: [new Array(), []]
	}
}
const isTests = {
	integer: {
		is: isInt,
		vals: [0.0, -1.0, 1.0, new Number(1.0), new Number(0.0)],
		ivals: [true, false, undefined, 0.1, 1 / 0, -1 / 0, NaN, {}, function() {}]
	},
	primitive: {
		is: isPrimitive,
		vals: [true, false, 1, -0.1, NaN, '', 'abc', function() {}],
		ivals: [{}, new String(), new Boolean(), /^1/]
	},
	arrayLike: {
		is: isArrayLike,
		vals: [
			new Array(),
			[],
			new Array(10),
			[1, 2, 3],
			'',
			'   ',
			'123',
			getArgs(1, 2, 3),
			{ length: 0 },
			{ length: 10, 9: undefined }
		]
			.concat(global.Int8Array ? [new Int8Array()] : [])
			.concat(global.document ? [document.body.children, document.body.childNodes] : []),
		ivals: [1, { length: 10 }, {}]
	},
	blank: {
		is: isBlank,
		vals: ['', '     ', [], new Array(), getArgs(), { length: 0 }, null, undefined, 0, false].concat(
			global.Int8Array ? [new Int8Array()] : []
		),
		ivals: ['a', getArgs(undefined), 1, true, [1], new Array(1), {}].concat(
			global.Int8Array ? [new Int8Array(1)] : []
		)
	}
}

describe('IS', () => {
	each(typeTests, function(test, name) {
		it(name, function() {
			each(test.vals, function(v, i) {
				expect(test.is(v)).to.equal(true)
			})
			each(typeTests, function(t) {
				if (t !== test) {
					each(t.vals, function(v, i) {
						expect(test.is(v)).to.equal(false)
					})
				}
			})
		})
	})
	each(isTests, function(test, name) {
		it(name, function() {
			each(test.vals, function(v, i) {
				expect(test.is(v)).to.equal(true)
			})
			each(test.ivals, function(v, i) {
				expect(test.is(v)).to.equal(false)
			})
		})
	})
	it('is', function() {
		each(typeTests, function(test, name) {
			if (test.type) {
				each(test.vals, function(v, i) {
					expect(is(v, test.type)).to.equal(true)
				})
				each(typeTests, function(t) {
					if (t !== test) {
						each(t.vals, function(v, i) {
							expect(is(v, test.type)).to.equal(false)
						})
					}
				})
			}
		})
		expect(is(true, [Boolean, Number, String, Date])).to.equal(true)
		expect(is(1, [Boolean, Number, String, Date])).to.equal(true)
		expect(is('1', [Boolean, Number, String, Date])).to.equal(true)
		expect(is(new Date(), [Boolean, Number, String, Date])).to.equal(true)
		expect(is({}, [Boolean, Number, String, Date])).to.equal(false)
		expect(is(/^1/, [Boolean, Number, String, Date])).to.equal(false)
	})
})
