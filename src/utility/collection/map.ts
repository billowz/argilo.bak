/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 19:37:30 GMT+0800 (China Standard Time)
 */

import { Control } from './Control'
import { STOP, eachArray, reachArray, eachObj } from './each'
import { IArray } from '../consts'
import { create } from '../create'
import { bind } from '../fn'
import { isArrayLike, isBool } from '../is'

/**
 * SKIP Control
 * > skip map
 */
export const SKIP = new Control('SKIP')

//========================================================================================
/*                                                                                      *
 *                                    map object                                   *
 *                                                                                      */
//========================================================================================

/**
 * callback on object
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param value	property value
 * @param prop	property name
 * @param obj	map target
 */
export type MapObjCallback<T> = (callback: any, prop: string, obj: object) => T | Control

export function doMapObj<T>(
	each: typeof eachObj,
	obj: object,
	callback: MapObjCallback<T>,
	own?: boolean
): { [key: string]: T }
export function doMapObj<T>(
	each: typeof eachObj,
	obj: object,
	callback: MapObjCallback<T>,
	scope?: any,
	own?: boolean
): { [key: string]: T }
export function doMapObj<T>(
	each: typeof eachObj,
	obj: object,
	callback: MapObjCallback<T>,
	scope?: any,
	own?: boolean
): { [key: string]: T } {
	if (isBool(scope)) {
		own = scope
	} else {
		callback = bind(callback, scope)
	}
	const copy: { [key: string]: T } = create(null)
	each(
		obj,
		(value, prop, obj) => {
			const v = callback(value, prop, obj)
			if (v === STOP) return STOP
			if (v !== SKIP) copy[prop] = v as T
		},
		null,
		own
	)
	return copy
}

/**
 * object: map
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param obj		map target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		map own properties, default: true
 */
export function mapObj<T>(obj: object, callback: MapObjCallback<T>, own?: boolean): { [key: string]: T }
export function mapObj<T>(obj: object, callback: MapObjCallback<T>, scope?: any, own?: boolean): { [key: string]: T }
export function mapObj<T>(obj: object, callback: MapObjCallback<T>, scope?: any, own?: boolean): { [key: string]: T } {
	return doMapObj(eachObj, obj, callback, scope, own)
}

//========================================================================================
/*                                                                                      *
 *                                     indexof Array                                    *
 *                                                                                      */
//========================================================================================

/**
 * callback on array
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param data	item data
 * @param index	item index
 * @param array	map target
 */
export type MapArrayCallback<T> = (data: any, index: number, array: IArray) => T | Control

export function doMapArray<T>(each: typeof eachArray, array: IArray, callback: MapArrayCallback<T>, scope?: any): T[] {
	callback = bind(callback, scope)
	const copy: T[] = []
	let j = 0
	each(array, (data, index, array) => {
		const v = callback(data, index, array)
		if (v === STOP) return STOP
		if (v !== SKIP) copy[j++] = v as T
	})
	return copy
}

/**
 * array: map
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param array		map target
 * @param value		callback
 * @param scope		scope of callback
 * @return array index or -1
 */
export function mapArray<T>(array: IArray, callback: MapArrayCallback<T>, scope?: any): T[] {
	return doMapArray(eachArray, array, callback, scope)
}

/**
 * revice array: map
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param array		map target
 * @param value		map value of callback
 * @param scope		scope of callback
 * @return array index or -1
 */
export function rmapArray<T>(array: IArray, callback: MapArrayCallback<T>, scope?: any): T[] {
	return doMapArray(reachArray, array, callback, scope)
}

//========================================================================================
/*                                                                                      *
 *                                       map                                       *
 *                                                                                      */
//========================================================================================

export function doMap<T>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: IArray,
	callback: MapArrayCallback<T>,
	scope?: any
): any[]
export function doMap<T>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object,
	callback: MapObjCallback<T>,
	own?: boolean
): { [key: string]: T }
export function doMap<T>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object,
	callback: MapObjCallback<T>,
	scope?: any,
	own?: boolean
): { [key: string]: T }
export function doMap<T>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object | IArray,
	callback: MapObjCallback<T> | MapArrayCallback<T>,
	own?: boolean
): { [key: string]: T } | any[]
export function doMap<T>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object | IArray,
	callback: MapObjCallback<T> | MapArrayCallback<T>,
	scope?: any,
	own?: boolean
): { [key: string]: T } | any[]
export function doMap<T>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: any,
	callback: any,
	scope?: any,
	own?: boolean
): { [key: string]: T } | any[] {
	if (isArrayLike(obj)) return doMapArray(eacharray, obj, callback, scope)
	return doMapObj(eachobj, obj, callback, scope, own)
}

/**
 * map
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @param obj		map target
 * @param value		map value of callback
 * @param scope		scope of callback
 * @param own		map own properties on object, default: true
 * @return array index or property name or -1
 */
export function map<T>(obj: IArray, callback: MapArrayCallback<T>, scope?: any): any[]
export function map<T>(obj: object, callback: MapObjCallback<T>, own?: boolean): { [key: string]: T }
export function map<T>(obj: object, callback: MapObjCallback<T>, scope?: any, own?: boolean): { [key: string]: T }
export function map<T>(
	obj: object | IArray,
	callback: MapObjCallback<T> | MapArrayCallback<T>,
	own?: boolean
): { [key: string]: T } | any[]
export function map<T>(
	obj: object | IArray,
	callback: MapObjCallback<T> | MapArrayCallback<T>,
	scope?: any,
	own?: boolean
): { [key: string]: T } | any[]
export function map<T>(obj: object | IArray, callback: any, scope?: any, own?: boolean): { [key: string]: T } | T[] {
	return doMap(eachArray, eachObj, obj, callback, scope, own)
}
