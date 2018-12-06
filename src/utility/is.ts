/**
 * type checker
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Mon Dec 03 2018 17:48:07 GMT+0800 (China Standard Time)
 */

import { CONSTRUCTOR, GLOBAL, TYPE_BOOL, TYPE_FN, TYPE_NUM, TYPE_STRING, TYPE_UNDEF } from './consts'

/**
 * is equals
 * > o1 === o2 || NaN === NaN
 */
export function eq(o1: any, o2: any): boolean {
	return o1 === o2 || (o1 !== o1 && o2 !== o2)
}

//========================================================================================
/*                                                                                      *
 *                                    primitive type                                    *
 *                                                                                      */
//========================================================================================

/**
 * is null
 */
export function isNull(o: any): boolean {
	return o === null
}

/**
 * is undefined
 */
export function isUndef(o: any): boolean {
	return o === undefined
}

/**
 * is null or undefined
 */
export function isNil(o: any): boolean {
	return o === null || o === undefined
}

/**
 * is boolean
 */
export const isBool: (o: any) => boolean = mkIsPrimitive(TYPE_BOOL)

/**
 * is a number
 */
export const isNum: (o: any) => boolean = mkIsPrimitive(TYPE_NUM)

/**
 * is a string
 */
export const isStr: (o: any) => boolean = mkIsPrimitive(TYPE_STRING)

/**
 * is a function
 */
export const isFn: (o: any) => boolean = mkIsPrimitive(TYPE_FN)

/**
 * is integer number
 */
export function isInt(o: any): boolean {
	return o === 0 || (o ? typeof o === TYPE_NUM && o % 1 === 0 : false)
}

/**
 * is primitive type
 * - null
 * - undefined
 * - boolean
 * - number
 * - string
 * - function
 */
export function isPrimitive(o: any): boolean {
	if (o === undefined || o === null) {
		return true
	}
	switch (typeof o) {
		case TYPE_BOOL:
		case TYPE_NUM:
		case TYPE_STRING:
		case TYPE_FN:
			return true
	}
	return false
}

function mkIsPrimitive(type: string): (o: any) => boolean {
	return function is(o: any): boolean {
		return typeof o === type
	}
}

//========================================================================================
/*                                                                                      *
 *                                    reference type                                    *
 *                                                                                      */
//========================================================================================

/**
 * is instanceof
 */
export function instOf(obj: any, Cls: Function): boolean {
	return obj !== undefined && obj !== null && obj instanceof Cls
}

/**
 * is child instance of Type
 */
export function is(o: any, Type: Function | Function[]): boolean {
	if (o !== undefined && o !== null) {
		const C = o[CONSTRUCTOR] || Object
		if (Type[CONSTRUCTOR] === Array) {
			var i = Type.length
			while (i--) {
				if (C === (Type as Function[])[i]) {
					return true
				}
			}
		} else {
			return C === Type
		}
	}
	return false
}

/**
 * is boolean or Boolean
 */
export const isBoolean: (o: any) => boolean = mkIs(Boolean)

/**
 * is number or Number
 */
export const isNumber: (o: any) => boolean = mkIs(Number)

/**
 * is string or String
 */
export const isString: (o: any) => boolean = mkIs(String)

/**
 * is Date
 */
export const isDate: (o: any) => boolean = mkIs(Date)

/**
 * is RegExp
 */
export const isReg: (o: any) => boolean = mkIs(RegExp)

/**
 * is Array
 */
export const isArray: (o: any) => boolean = Array.isArray || mkIs(Array)

/**
 * is Typed Array
 */
export const isTypedArray: (o: any) => boolean = isFn(ArrayBuffer) ? ArrayBuffer.isView : () => false

/**
 * is Array or pseudo-array
 * - Array
 * - String
 * - IArguments
 * - NodeList
 * - HTMLCollection
 * - Typed Array
 * - {length: int, [length-1]: any}
 */
export function isArrayLike(o: any): boolean {
	if (o) {
		switch (o[CONSTRUCTOR]) {
			case Array:
			case String:
			case GLOBAL.NodeList:
			case GLOBAL.HTMLCollection:
			case GLOBAL.Int8Array:
			case GLOBAL.Uint8Array:
			case GLOBAL.Int16Array:
			case GLOBAL.Uint16Array:
			case GLOBAL.Int32Array:
			case GLOBAL.Uint32Array:
			case GLOBAL.Float32Array:
			case GLOBAL.Float64Array:
				return true
		}
		const len = o.length
		return typeof len === TYPE_NUM && (len === 0 || (len > 0 && len % 1 === 0 && len - 1 in o))
	}
	return o === ''
}

/**
 * is simple Object
 * TODO object may has constructor property
 */
export function isObj(o: any): boolean {
	if (o === undefined || o === null) {
		return false
	}
	const C = o[CONSTRUCTOR]
	return C === undefined || C === Object
}

function mkIs(Type: Function): (o: any) => boolean {
	return function is(o: any): boolean {
		return o !== undefined && o !== null && o[CONSTRUCTOR] === Type
	}
}

const blankStrReg = /^\s*$/
/**
 * is empty
 * - string: trim(string).length === 0
 * - array: array.length === 0
 * - pseudo-array: pseudo-array.length === 0
 */
export function isBlank(o: any): boolean {
	if (o) {
		if (o[CONSTRUCTOR] === String) {
			return blankStrReg.test(o)
		}
		return o.length === 0
	}
	return true
}
