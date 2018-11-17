// @flow
/**
 * @module helper/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 18:55:47 GMT+0800 (China Standard Time)
 */

import { STOP, eachArray, reachArray, eachObj } from './each'
import { bind, applyNoScope } from '../fn'
import { hasOwnProp } from '../prop'
import { isArrayLike, isStr, isBool, isFn, eq } from '../is'

import type { PseudoArray } from './each'

/**
 * indexOf callback
 * - will stop find on callback return STOP
 * @callback IdxOfCallback
 * @param  {any} 				data	item data
 * @param  {string|number} 		index	item index
 * @param  {Object|PseudoArray}	obj		indexOf target
 * @returns {any}
 * - true: finded
 * - STOP: stop find
 */
export type IdxOfCallback = (data: any, index: string | number, obj: Object | PseudoArray) => any

/**
 * indexOf callback on object
 * - will stop find on callback return STOP
 * @callback IdxOfObjCallback
 * @param  {any} 			value	property value
 * @param  {string} 		prop	property name
 * @param  {Object}			obj		indexOf target
 * @returns {any}
 * - true: finded
 * - STOP: stop find
 */
export type IdxOfObjCallback = (value: any, prop: string, obj: Object) => any

export function mkIdxOfObj(
	each: typeof eachObj
): (obj: Object, value: IdxOfObjCallback | any, scope?: any, own?: boolean) => number | string {
	return function idxOfObj(obj, value, scope, own) {
		if (isBool(scope)) {
			own = scope
			scope = null
		}
		const callback: IdxOfObjCallback = parseCallback(value, scope)
		let idx = -1
		each(
			obj,
			(data, prop, obj) => {
				const r = callback(data, prop, obj)
				if (r === true) {
					idx = prop
					return STOP
				}
				return r
			},
			null,
			own !== false
		)
		return idx
	}
}

/**
 * indexOf callback on array or pseudo-array
 * - will stop find on callback return STOP
 * @callback IdxOfArrayCallback
 * @param  {any} 			data	item data
 * @param  {number} 		index	item index
 * @param  {PseudoArray}	obj		indexOf target
 * @returns {any}
 * - true: finded
 * - STOP: stop find
 */
export type IdxOfArrayCallback = (data: any, index: number, obj: PseudoArray) => any

function mkIdxOfArray(
	each: typeof eachArray
): (array: PseudoArray, value: IdxOfArrayCallback | any, scope?: any) => number {
	return function(array, value, scope) {
		const callback: IdxOfArrayCallback = parseCallback(value, scope)
		let idx = -1
		each(array, (data, index, obj) => {
			const r = callback(data, index, obj)
			if (r === true) {
				idx = index
				return STOP
			}
			return r
		})
		return idx
	}
}

function parseCallback(value: any, scope: any): Function {
	if (isFn(value)) return bind(value, scope)
	return function(data, idx, obj) {
		return eq(data, value)
	}
}

export function mkIdxOf(
	idxOfArray: IdxOfArray,
	idxOfObj: IdxOfObj
): (obj: Object | PseudoArray, value: IdxOfCallback | any, scope?: any, own?: boolean) => number | string {
	return function idxOf(obj, value, scope, own) {
		if (isArrayLike(obj)) return idxOfArray((obj: any), value, scope)
		return idxOfObj((obj: any), value, scope, own)
	}
}

/**
 * object: indexOf
 * - will stop find on callback return STOP
 * overrides:
 * - idxOfObj(obj: Object, callback: IdxOfCallback, scope?: any, own?: boolean): -1 | string
 * - idxOfObj(obj: Object, data: any, own?: boolean): -1 | string
 * @function
 * @param  {Object} 				obj			find target
 * @param  {any|IdxOfObjCallback} 	callback	find value or callback
 * @param  {Object} 				[scope]		scope of callback
 * @param  {boolean} 				[own=true]	find own properties
 * @returns {number | string} -1: not find
 */
export const idxOfObj: (
	obj: Object,
	value: IdxOfObjCallback | any,
	scope?: any,
	own?: boolean
) => number | string = mkIdxOfObj(eachObj)

/**
 * array: indexOf
 * - will stop find on callback return STOP
 * @function
 * @param  {PseudoArray}			array		find target: array or pseudo-array
 * @param  {any|IdxOfArrayCallback}	value		find value or callback
 * @param  {any} 					[scope]		scope of callback
 * @return {number} -1: not find
 */
export const idxOfArray: (array: PseudoArray, value: IdxOfArrayCallback | any, scope?: any) => number = mkIdxOfArray(
	eachArray
)

/**
 * revice array: indexOf
 * - will stop find on callback return STOP
 * @function
 * @param  {PseudoArray}			array		find target: array or pseudo-array
 * @param  {any|IdxOfArrayCallback} value		find value of callback
 * @param  {any} 					[scope]		scope of callback
 * @return {number} -1: not find
 */
export const ridxOfArray: (array: PseudoArray, value: IdxOfArrayCallback | any, scope?: any) => number = mkIdxOfArray(
	reachArray
)

/**
 * indexOf
 * - will stop find on callback return STOP
 * overrides:
 * - idxOf(obj: any, callback: {IdxOfCallback}, scope?: any, own?: boolean): number | string
 * - idxOf(obj: any, data: any, own?: boolean): number | string
 * @function
 * @param  {Object|PseudoArray} obj			find target
 * @param  {any|IdxOfCallback} 	value		find value of callback
 * @param  {Object} 			[scope]		scope of callback
 * @param  {boolean} 			[own=true]	find own properties on object
 * @returns {number | string} -1: not find
 */
export const idxOf: (
	obj: Object | PseudoArray,
	value: IdxOfCallback | any,
	scope?: any,
	own?: boolean
) => number | string = mkIdxOf(idxOfArray, idxOfObj)

// /**
//  * idxOf callback
//  * @callback IdxOfCallback
//  * @param  {any} 			data	item data
//  * @param  {string|number} 	idx	item idx
//  * @param  {any}	 		obj		idxOf target
//  * @returns {boolean}
//  */
// export type IdxOfCallback = (data: any, idx: string | number, obj: any) => boolean

// /**
//  * idxOf array
//  * @param  {PseudoArray}	array		idxOf target: array or pseudo-array
//  * @param  {IdxOfCallback} callback	callback
//  * @param  {any} 			[scope]		scope of callback
//  * @returns {number}
//  */
// export function idxOfArray(array: any, data: any, scope?: any): number {
// 	const callback: IdxOfCallback = parseCallback(data),
// 		l = array.length
// 	for (let i = 0; i < l; i++) if (callback(array[i], i, array) === true) return i
// 	return -1
// }

// /**
//  * revice idxOf array
//  * @param  {PseudoArray}	array		idxOf target: array or pseudo-array
//  * @param  {IdxOfCallback} 	callback	callback
//  * @param  {any} 			[scope]		scope of callback
//  * @returns {Array}
//  */
// export function ridxOfArray(array: any, data: any, scope?: any): Array {
// 	const callback: IdxOfCallback = parseCallback(data),
// 		i = array.length
// 	while (i--) if (callback(array[i], i, array) === true) break
// 	return i
// }

// /**
//  * idxOf object
//  *
//  * overrides:
//  * - idxOfObj(obj: Object, callback: IdxOfCallback, scope?: any, own?: boolean): string
//  * - idxOfObj(obj: Object, data: any, own?: boolean): string
//  * @param  {Object} 		obj			idxOf target
//  * @param  {any} 			data		find data or callback
//  * @param  {Object} 		[scope]		scope of callback
//  * @param  {boolean} 		[own=true]	idxOf own properties
//  * @returns {string}
//  */
// export function idxOfObj(obj: Object, data: any): string {
// 	return __idxOfObj(obj, data, arguments, 2)
// }

// function __idxOfObj(obj: Object, data: any, args: Array, i: number): string | number {
// 	const callback: IdxOfCallback = parseCallback(data),
// 		oi = isFn(data) ? i + 1 : i,
// 		scope: any = oi !== i && args[i],
// 		own: boolean = args[oi]
// 	let k
// 	if (own === false) {
// 		for (k in obj) if (callback(obj[k], k, obj) === true) return k
// 	} else {
// 		for (k in obj) if (hasOwnProp(obj, k) && callback(obj[k], k, obj) === true) return k
// 	}
// 	return -1
// }

// /**
//  * idxOf
//  * @param  {any} 			obj			idxOf target
//  * @param  {any} 			data		find data or callback
//  * @param  {Object} 		[scope]		scope of callback
//  * @param  {boolean} 		[own=true]	idxOf own properties of idxOf object
//  * @returns {Object|Array}
//  */
// export function idxOf(obj: any, data: any): number | string {
// 	if (isArrayLike(obj)) return idxOfArray(obj, data, args[2])
// 	return __idxOfObj(obj, data, arguments, 2)
// }

// function parseCallback(obj: any): IdxOfCallback {
// 	if (isFn(obj)) return obj
// 	return function(data: any, idx: string | number, obj: any): boolean {
// 		return eq(data, val)
// 	}
// }
