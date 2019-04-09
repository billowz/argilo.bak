/**
 * @module util/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Thu Apr 04 2019 19:32:32 GMT+0800 (China Standard Time)
 */

import { Control } from './Control'
import { STOP, eachArray, reachArray, eachObj } from './each'
import { IArray } from '../consts'
import { bind } from '../fn'
import { isArrayLike, isBool, isFn, eq } from '../is'

function parseCallback(value: any, scope: any): any {
	if (isFn(value)) return bind(value, scope)
	return function defaultHandler(data: any, idx: any, obj: any) {
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
export type IdxOfObjCallback<E> = (value: E, prop: string, obj: { [key: string]: E }) => boolean | Control | void

export function doIdxOfObj<E>(each: typeof eachObj, obj: { [key: string]: E }, value: E, own?: boolean): -1 | string
export function doIdxOfObj<E>(
	each: typeof eachObj,
	obj: { [key: string]: E },
	value: IdxOfObjCallback<E>,
	own?: boolean
): -1 | string
export function doIdxOfObj<E>(
	each: typeof eachObj,
	obj: { [key: string]: E },
	value: IdxOfObjCallback<E>,
	scope?: any,
	own?: boolean
): -1 | string

export function doIdxOfObj<E>(
	each: typeof eachObj,
	obj: { [key: string]: E },
	value: IdxOfObjCallback<E> | E,
	scope?: any,
	own?: boolean
): -1 | string {
	if (isBool(scope)) {
		own = scope
		scope = null
	}
	const callback: IdxOfObjCallback<E> = parseCallback(value, scope)
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
export function idxOfObj<E>(obj: { [key: string]: E }, value: E, own?: boolean): -1 | string
export function idxOfObj<E>(obj: { [key: string]: E }, value: IdxOfObjCallback<E>, own?: boolean): -1 | string
export function idxOfObj<E>(
	obj: { [key: string]: E },
	value: IdxOfObjCallback<E>,
	scope?: any,
	own?: boolean
): -1 | string
export function idxOfObj<E>(
	obj: { [key: string]: E },
	value: IdxOfObjCallback<E> | E,
	scope?: any,
	own?: boolean
): -1 | string {
	return doIdxOfObj(eachObj, obj, value as any, scope, own)
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
export type IdxOfArrayCallback<E> = (data: E, index: number, array: IArray<E>) => boolean | Control | void

export function doIdxOfArray<E>(each: typeof eachArray, array: IArray<E>, value: E): number
export function doIdxOfArray<E>(
	each: typeof eachArray,
	array: IArray<E>,
	value: IdxOfArrayCallback<E>,
	scope?: any
): number
export function doIdxOfArray<E>(
	each: typeof eachArray,
	array: IArray<E>,
	value: IdxOfArrayCallback<E> | E,
	scope?: any
): number {
	const callback: IdxOfArrayCallback<E> = parseCallback(value, scope)
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
export function idxOfArray<E>(array: IArray<E>, value: E): number
export function idxOfArray<E>(array: IArray<E>, value: IdxOfArrayCallback<E>, scope?: any): number
export function idxOfArray<E>(array: IArray<E>, value: IdxOfArrayCallback<E> | any, scope?: any): number {
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
export function ridxOfArray<E>(array: IArray<E>, value: E): number
export function ridxOfArray<E>(array: IArray<E>, value: IdxOfArrayCallback<E>, scope?: any): number
export function ridxOfArray<E>(array: IArray<E>, value: IdxOfArrayCallback<E> | any, scope?: any): number {
	return doIdxOfArray(reachArray, array, value, scope)
}

//========================================================================================
/*                                                                                      *
 *                                       index of                                       *
 *                                                                                      */
//========================================================================================
// find by value
export function doIdxOf<E>(eacharray: typeof eachArray, eachobj: typeof eachObj, obj: IArray<E>, value: E): number
export function doIdxOf<E>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: { [key: string]: E },
	value: E,
	own?: boolean
): string
export function doIdxOf<E>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: { [key: string]: E } | IArray<E>,
	value: E,
	own?: boolean
): number | string
// find by callback
export function doIdxOf<E>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: IArray<E>,
	value: IdxOfArrayCallback<E>,
	scope?: any
): number
export function doIdxOf<E>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: { [key: string]: E },
	value: IdxOfObjCallback<E>,
	own?: boolean
): -1 | string
export function doIdxOf<E>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: { [key: string]: E },
	value: IdxOfObjCallback<E>,
	scope?: any,
	own?: boolean
): -1 | string
export function doIdxOf<E>(
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
export function idxOf<E>(obj: IArray<E>, value: E): number | string
export function idxOf<E>(obj: { [key: string]: E }, value: E, own?: boolean): number | string
export function idxOf<E>(obj: { [key: string]: E } | IArray<E>, value: E, own?: boolean): number | string
export function idxOf<E>(obj: IArray<E>, value: IdxOfArrayCallback<E>, scope?: any): number
export function idxOf<E>(obj: { [key: string]: E }, value: IdxOfObjCallback<E>, own?: boolean): -1 | string
export function idxOf<E>(obj: { [key: string]: E }, value: IdxOfObjCallback<E>, scope?: any, own?: boolean): -1 | string
export function idxOf<E>(obj: any, value: any, scope?: any, own?: boolean): number | string {
	return doIdxOf(eachArray, eachObj, obj, value, scope, own)
}
