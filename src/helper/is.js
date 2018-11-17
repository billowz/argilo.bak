// @flow
/**
 * type checker
 * @module helper/is
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Thu Nov 15 2018 19:02:35 GMT+0800 (China Standard Time)
 */

import { CONSTRUCTOR, global } from './consts'

const BOOL = 'boolean',
	FN = 'function',
	NUM = 'number',
	STR = 'string'

/**
 * is equals
 * > o1 === o2 || NaN === NaN
 * @param  {any} o1
 * @param  {any} o2
 * @returns {boolean}
 */
export function eq(o1: any, o2: any): boolean {
	return o1 === o2 || (o1 !== o1 && o2 !== o2)
}

/**
 * is null
 * @param  {any} o
 * @returns {boolean}
 */
export function isNull(o: any): boolean {
	return o === null
}

/**
 * is undefined
 * @param  {any} o
 * @returns {boolean}
 */
export function isUndef(o: any): boolean {
	return o === undefined
}

/**
 * is null or undefined
 * @param  {any} o
 * @returns {boolean}
 */
export function isNil(o: any): boolean {
	return o === null || o === undefined
}

/**
 * is a Function
 * @param  {any} o
 * @returns {boolean}
 */
export function isFn(fn: any): boolean {
	return typeof fn === FN
}

/**
 * is child instance of Type
 * @param {any} o
 * @param {Function} Type
 */
export function is(o: any, Type: Function): boolean {
	if (o === undefined || o === null) return false
	const c = o[CONSTRUCTOR]
	if (Type[CONSTRUCTOR] === Array) {
		if (c) {
			for (var i = 0, l = Type.length; i < l; i++) if (c === Type[i]) return true
		} else {
			for (var i = 0, l = Type.length; i < l; i++) if (Type[i] === Object) return true
		}
		return false
	}
	return c ? c === Type : Type === Object
}

// TODO object has constructor property
/**
 * is simple Object
 * @param  {any} o
 * @returns {boolean}
 */
export function isObj(o: any): boolean {
	if (o === undefined || o === null) return false
	const C = o[CONSTRUCTOR]
	return C === undefined || C === Object
}

function mkIs(Type: Function): (o: any) => boolean {
	return o => o !== undefined && o !== null && o[CONSTRUCTOR] === Type
}

/**
 * is boolean or Boolean
 * @function isBool
 * @static
 * @param  {any} o
 * @returns {boolean}
 */
export const isBool: (o: any) => boolean = mkIs(Boolean)

/**
 * is a number or Number
 * @function isNum
 * @static
 * @param  {any} o
 * @returns {boolean}
 */
export const isNum: (o: any) => boolean = mkIs(Number)

/**
 * is string or String
 * @function isStr
 * @static
 * @param  {any} o
 * @returns {boolean}
 */
export const isStr: (o: any) => boolean = mkIs(String)

/**
 * is Date
 * @function isDate
 * @static
 * @param  {any} o
 * @returns {boolean}
 */
export const isDate: (o: any) => boolean = mkIs(Date)

/**
 * is number
 * @function isReg
 * @static
 * @param  {any} o
 * @returns {boolean}
 */
export const isReg: (o: any) => boolean = mkIs(RegExp)

/**
 * is Array
 * @function isArray
 * @static
 * @param  {any} o
 * @returns {boolean}
 */
export const isArray: (o: any) => boolean = Array.isArray || mkIs(Array)

/**
 * is integer number
 * @param  {any} o
 * @returns {boolean}
 */
export function isInt(o: any): boolean {
	return o === 0 || (o ? o[CONSTRUCTOR] === Number && o % 1 === 0 : false)
}

/**
 * is Typed Array
 * @function isTypedArray
 * @static
 * @param  {any} o
 * @returns {boolean}
 */
export const isTypedArray: (o: any) => boolean = ArrayBuffer ? ArrayBuffer.isView : () => false

/**
 * is Array or pseudo-array
 * - Array
 * - String
 * - Arguments
 * - NodeList
 * - HTMLCollection
 * - Typed Array
 * - {length: int, [length-1]: any}
 *
 * @param  {any} o
 * @returns {boolean}
 */
export function isArrayLike(o: any): boolean {
	if (o === undefined || o === null) return false
	switch (o[CONSTRUCTOR]) {
		case Array:
		case String:
		case global.NodeList:
		case global.HTMLCollection:
		case global.Int8Array:
		case global.Uint8Array:
		case global.Int16Array:
		case global.Uint16Array:
		case global.Int32Array:
		case global.Uint32Array:
		case global.Float32Array:
		case global.Float64Array:
			return true
	}
	const len = o.length
	return typeof len === NUM && (len === 0 || (len > 0 && len % 1 === 0 && len - 1 in o))
}

/**
 * is instanceof
 * @param  {any} obj
 * @param  {Function} cls
 * @returns {boolean}
 */
export function isInstOf(obj: any, Cls: Function): boolean {
	return obj !== undefined && obj !== null && obj instanceof Cls
}

/**
 * is primitive type
 * - null
 * - undefined
 * - boolean
 * - number
 * - string
 * - Function
 * @param  {any} o
 * @returns {boolean}
 */
export function isPrimitive(o: any): boolean {
	if (o === undefined || o === null) return true
	switch (typeof o) {
		case BOOL:
		case NUM:
		case STR:
		case FN:
			return true
	}
	return false
}

const blankStrReg = /^\s*$/
/**
 * is empty
 * - string: trim(string).length === 0
 * - array: array.length === 0
 * - pseudo-array: pseudo-array.length === 0
 * @param  {any} o
 * @returns {boolean}
 */
export function isBlank(o: any): boolean {
	if (!o) return true
	if (o[CONSTRUCTOR] === String) return blankStrReg.test(o)
	return o.length === 0
}
