/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 13:38:16 GMT+0800 (China Standard Time)
 */

import { Control } from './control'
import { STOP, eachArray, reachArray, eachObj } from './each'
import { IArray } from '../consts'
import { bind } from '../fn'
import { isArrayLike, isBool, isFn, eq } from '../is'

function parseCallback(value: any, scope: any) {
	if (isFn(value)) return bind(value, scope)
	return function defaultHandler(data, idx, obj) {
		return eq(data, value)
	}
}

//========================================================================================
/*                                                                                      *
 *                                    index of object                                   *
 *                                                                                      */
//========================================================================================

/**
 * indexOf callback on object
 * - will stop find on callback return STOP
 * @param value	property value
 * @param prop	property name
 * @param obj		indexOf target
 * @return
 * - boolean: is finded
 * - void: find next
 * - STOP: stop find
 */
export type IdxOfObjCallback = (value: any, prop: string, obj: object) => boolean | Control | void

export function doIdxOfObj(each: typeof eachObj, obj: object, value: any, own?: boolean): -1 | string
export function doIdxOfObj(each: typeof eachObj, obj: object, value: IdxOfObjCallback, own?: boolean): -1 | string
export function doIdxOfObj(
	each: typeof eachObj,
	obj: object,
	value: IdxOfObjCallback,
	scope?: any,
	own?: boolean
): -1 | string

export function doIdxOfObj(
	each: typeof eachObj,
	obj: object,
	value: IdxOfObjCallback | any,
	scope?: any,
	own?: boolean
): -1 | string {
	if (isBool(scope)) {
		own = scope
		scope = null
	}
	const callback: IdxOfObjCallback = parseCallback(value, scope)
	let idx: -1 | string = -1
	each(
		obj,
		(data, prop, obj) => {
			const r = callback(data, prop, obj)
			if (r === true) {
				idx = prop
				return STOP
			} else if (r === STOP) return r
		},
		null,
		own
	)
	return idx
}

/**
 * object: indexOf
 * - will stop find on callback return STOP
 * @param obj		find target
 * @param callback	find value or callback
 * @param scope		scope of callback
 * @param own		find own properties, default: true
 * @return property name or -1
 */
export function idxOfObj(obj: object, value: any, own?: boolean): -1 | string
export function idxOfObj(obj: object, value: IdxOfObjCallback, own?: boolean): -1 | string
export function idxOfObj(obj: object, value: IdxOfObjCallback, scope?: any, own?: boolean): -1 | string
export function idxOfObj(obj: object, value: IdxOfObjCallback | any, scope?: any, own?: boolean): -1 | string {
	return doIdxOfObj(eachObj, obj, value, scope, own)
}

//========================================================================================
/*                                                                                      *
 *                                     indexof Array                                    *
 *                                                                                      */
//========================================================================================

/**
 * indexOf callback on array
 * - will stop find on callback return STOP
 * @param data	item data
 * @param index	item index
 * @param array	indexOf target
 * @return
 * - boolean: is finded
 * - void: find next
 * - STOP: stop find
 */
export type IdxOfArrayCallback = (data: any, index: number, array: IArray) => boolean | Control | void

export function doIdxOfArray(each: typeof eachArray, array: IArray, value: any): number
export function doIdxOfArray(each: typeof eachArray, array: IArray, value: IdxOfArrayCallback, scope?: any): number
export function doIdxOfArray(
	each: typeof eachArray,
	array: IArray,
	value: IdxOfArrayCallback | any,
	scope?: any
): number {
	const callback: IdxOfArrayCallback = parseCallback(value, scope)
	let idx = -1
	each(array, (data, index, array) => {
		const r = callback(data, index, array)
		if (r === true) {
			idx = index
			return STOP
		} else if (r === STOP) return r
	})
	return idx
}

/**
 * array: indexOf
 * - will stop find on callback return STOP
 * @param array		find target
 * @param value		find value or callback
 * @param scope		scope of callback
 * @return array index or -1
 */
export function idxOfArray(array: IArray, value: any): number
export function idxOfArray(array: IArray, value: IdxOfArrayCallback, scope?: any): number
export function idxOfArray(array: IArray, value: IdxOfArrayCallback | any, scope?: any): number {
	return doIdxOfArray(eachArray, array, value, scope)
}

/**
 * revice array: indexOf
 * - will stop find on callback return STOP
 * @param array		find target
 * @param value		find value of callback
 * @param scope		scope of callback
 * @return array index or -1
 */
export function ridxOfArray(array: IArray, value: any): number
export function ridxOfArray(array: IArray, value: IdxOfArrayCallback, scope?: any): number
export function ridxOfArray(array: IArray, value: IdxOfArrayCallback | any, scope?: any): number {
	return doIdxOfArray(reachArray, array, value, scope)
}

//========================================================================================
/*                                                                                      *
 *                                       index of                                       *
 *                                                                                      */
//========================================================================================
// find by value
export function doIdxOf(eacharray: typeof eachArray, eachobj: typeof eachObj, obj: IArray, value: any): number
export function doIdxOf(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object,
	value: any,
	own?: boolean
): string
export function doIdxOf(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object | IArray,
	value: any,
	own?: boolean
): number | string
// find by callback
export function doIdxOf(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: IArray,
	value: IdxOfArrayCallback,
	scope?: any
): number
export function doIdxOf(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object,
	value: IdxOfObjCallback,
	own?: boolean
): -1 | string
export function doIdxOf(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object,
	value: IdxOfObjCallback,
	scope?: any,
	own?: boolean
): -1 | string
export function doIdxOf(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object | IArray,
	value: IdxOfObjCallback | IdxOfArrayCallback,
	own?: boolean
): number | string
export function doIdxOf(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object | IArray,
	value: IdxOfObjCallback | IdxOfArrayCallback,
	scope?: any,
	own?: boolean
): number | string
export function doIdxOf(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: any,
	value: any,
	scope?: any,
	own?: boolean
): number | string {
	if (isArrayLike(obj)) return doIdxOfArray(eacharray, obj, value, scope)
	return doIdxOfObj(eachobj, obj, value, scope, own)
}

/**
 * indexOf
 * - will stop find on callback return STOP
 * @param obj		find target
 * @param value		find value of callback
 * @param scope		scope of callback
 * @param own		find own properties on object, default: true
 * @return array index or property name or -1
 */
export function idxOf(obj: IArray, value: any): number | string
export function idxOf(obj: object, value: any, own?: boolean): number | string
export function idxOf(obj: object | IArray, value: any, own?: boolean): number | string
export function idxOf(obj: IArray, value: IdxOfArrayCallback, scope?: any): number
export function idxOf(obj: object, value: IdxOfObjCallback, own?: boolean): -1 | string
export function idxOf(obj: object, value: IdxOfObjCallback, scope?: any, own?: boolean): -1 | string
export function idxOf(
	obj: object | IArray,
	value: IdxOfObjCallback | IdxOfArrayCallback,
	own?: boolean
): number | string
export function idxOf(
	obj: object | IArray,
	value: IdxOfObjCallback | IdxOfArrayCallback,
	scope?: any,
	own?: boolean
): number | string
export function idxOf(obj: object | IArray, value: any, scope?: any, own?: boolean): number | string {
	return doIdxOf(eachArray, eachObj, obj, value, scope, own)
}
