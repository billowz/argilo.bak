import { is, isBool, isInt, isArray, isArrayLike } from '../is'

suite(`isBool`, function() {
	bench(false)
	bench({}, '{}')

	function bench(v, name) {
		benchmark(`argilo.isBool: ${name || v}`, function() {
			isBool(v)
		})

		benchmark(`argilo.is: ${name || v}`, function() {
			is(v, Boolean)
		})

		benchmark(`compare: ${name || v}`, function() {
			compare(v)
		})

		benchmark(`typeof: ${name || v}`, function() {
			type(v)
		})

		benchmark(`instance: ${name || v}`, function() {
			inst(v)
		})

		benchmark(`Object.prototype.toString: ${name || v}`, function() {
			str(v)
		})
	}

	const type = _typeof(`boolean`)
	const inst = _is(Boolean)
	const str = _str(`[object Boolean]`)

	function compare(v) {
		return v === true || v === false
	}
})

suite(`isInteger`, function() {
	bench(0)
	bench(1)
	bench(1.1)
	bench('0', '"0"')

	function bench(v, name) {
		benchmark(`argilo.isInt: ${name || v}`, function() {
			isInt(v)
		})

		benchmark(`parseInt: ${name || v}`, function() {
			_isInt(v)
		})

		if (Number.isInteger)
			benchmark(`Number.isInteger: ${name || v}`, function() {
				Number.isInteger(v)
			})
	}

	function _isInt(v) {
		return typeof v === 'number' && parseInt(v) === v
	}
})

suite(`isArray`, function() {
	bench([], '[]')
	bench(arguments, 'arguments')

	function bench(v, name) {
		benchmark(`argilo.isArray: ${name || v}`, function() {
			isArray(v)
		})

		benchmark(`argilo.is: ${name || v}`, function() {
			is(v, Array)
		})

		benchmark(`Array.isArray: ${name || v}`, function() {
			Array.isArray(v)
		})

		benchmark(`instance: ${name || v}`, function() {
			inst(v)
		})

		benchmark(`instanceof: ${name || v}`, function() {
			instof(v)
		})

		benchmark(`Object.prototype.toString: ${name || v}`, function() {
			str(v)
		})
	}

	const inst = _is(Array)
	const str = _str(`[object Array]`)

	function instof(v) {
		v instanceof Array
	}
})

suite(`isArrayLike`, function() {
	bench([], '[0]')
	;(function() {
		if (this.Float32Array) bench(new Float32Array([1, 2]), 'Float32[2]')
	})()
	;(function() {
		bench(arguments, 'arguments[0]')
	})()
	;(function() {
		bench(arguments, 'arguments[3]')
	})(1, 2, 3)
	bench({ length: 1, 0: 1 }, '{1}')

	bench({ length: 1 }, '{!1}')

	bench({}, '{undefined}')

	bench({ length() {}, 0: 1 }, '{fn}')

	function bench(v, name) {
		benchmark(`argilo.isArrayLike: ${name || v}`, function() {
			isArrayLike(v)
		})

		benchmark(`instance + length: ${name || v}`, function() {
			inst(v)
		})

		benchmark(`Object.prototype.toString: ${name || v}`, function() {
			str(v)
		})
	}

	function inst(obj) {
		if (obj === undefined && obj === null) return false
		switch (obj.constructor) {
			case Array:
			case String:
			case NodeList:
			case HTMLCollection:
				return true
		}
		const len = obj.length
		return typeof len === 'number' && (!len || (parseInt(len) === len && len > 0 && len - 1 in obj))
	}

	const reg = /Array\]$/

	function str(obj) {
		var str = toStr.call(obj)
		switch (str) {
			case `[object String]`:
			case `[object Array]`:
			case `[object Arguments]`:
			case `[object NodeList]`:
			case `[object HTMLCollection]`:
				return true
		}
		const len = obj.length
		return typeof len === 'number' && (!len || (parseInt(len) === len && len > 0 && len - 1 in obj))
	}
})

function _typeof(type) {
	return obj => typeof obj === type
}

function _is(Type) {
	return obj => obj !== undefined && obj !== null && obj.constructor === Type
}

const toStr = Object.prototype.toString

function _str(fmt) {
	return obj => toStr.call(obj) === fmt
}
