/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 13:39:11 GMT+0800 (China Standard Time)
 */
import { Control } from './control'
import { IArray } from '../consts'
import { bind } from '../fn'
import { hasOwnProp } from '../prop'
import { isArrayLike, isBool } from '../is'

/**
 * STOP Control
 * > stop each/map/indexOf...
 */
export const STOP = new Control('STOP')
//========================================================================================
/*                                                                                      *
 *                                each object properties                                *
 *                                                                                      */
//========================================================================================

/**
 * each callback on object
 * - will stop each on return STOP
 */
export type EachPropCallback = (prop: string, obj: object) => Control | void

/**
 * each properties
 * - will stop each on callback return STOP
 * @param obj		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		each own properties, default: true
 * @return stoped property name or false
 */
export function eachProps(obj: object, callback: EachPropCallback, own: boolean): false | string
export function eachProps(obj: object, callback: EachPropCallback, scope?: any, own?: boolean): false | string
export function eachProps(obj: object, callback: EachPropCallback, scope?: any, own?: boolean): false | string {
	if (isBool(scope)) {
		own = scope
	} else {
		callback = bind(callback, scope)
	}
	let k: string
	if (own === false) {
		for (k in obj) if (callback(k, obj) === STOP) return k
	} else {
		for (k in obj) if (hasOwnProp(obj, k) && callback(k, obj) === STOP) return k
	}
	return false
}

//========================================================================================
/*                                                                                      *
 *                                      each object                                     *
 *                                                                                      */
//========================================================================================

/**
 * each callback on object
 * - will stop each on callback return STOP
 */
export type EachObjCallback = (value: any, prop: string, obj: object) => Control | void

/**
 * each object
 * - will stop each on callback return STOP
 * @param obj		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		each own properties, default: true
 * @return stoped property name or false
 */
export function eachObj(obj: object, callback: EachObjCallback, own: boolean): false | string
export function eachObj(obj: object, callback: EachObjCallback, scope?: any, own?: boolean): false | string
export function eachObj(obj: object, callback: EachObjCallback, scope?: any, own?: boolean): false | string {
	const args = arguments
	if (isBool(scope)) {
		own = scope
	} else {
		callback = bind(callback, scope)
	}
	let k: string
	if (own === false) {
		for (k in obj) if (callback(obj[k], k, obj) === STOP) return k
	} else {
		for (k in obj) if (hasOwnProp(obj, k) && callback(obj[k], k, obj) === STOP) return k
	}
	return false
}

//========================================================================================
/*                                                                                      *
 *                                      each array                                      *
 *                                                                                      */
//========================================================================================

/**
 * each callback on array
 * - will stop each on callback return STOP
 */
export type EachArrayCallback = (data: any, index: number, array: IArray) => Control | void

/**
 * each array
 * - will stop each on callback return STOP
 * @param array		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @return stoped index or false
 */
export function eachArray(array: IArray, callback: EachArrayCallback, scope?: any): false | number {
	callback = bind(callback, scope)
	for (let i = 0, l = array.length; i < l; i++) {
		if (callback(array[i], i, array) === STOP) return i
	}
	return false
}

/**
 * reverse each array
 * - will stop each on callback return STOP
 * @param array		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @return stoped index or false
 */
export function reachArray(array: IArray, callback: EachArrayCallback, scope?: any): false | number {
	callback = bind(callback, scope)
	let i = array.length
	while (i--) if (callback(array[i], i, array) === STOP) return i
	return false
}

//========================================================================================
/*                                                                                      *
 *                                         each                                         *
 *                                                                                      */
//========================================================================================

export function doEach(
	_eachArray: typeof eachArray,
	_eachObj: typeof eachObj,
	obj: IArray,
	callback: EachArrayCallback,
	scope?: any
): false | number
export function doEach(
	_eachArray: typeof eachArray,
	_eachObj: typeof eachObj,
	obj: object,
	callback: EachObjCallback,
	own?: boolean
): false | string
export function doEach(
	_eachArray: typeof eachArray,
	_eachObj: typeof eachObj,
	obj: object,
	callback: EachObjCallback,
	scope?: any,
	own?: boolean
): false | string
export function doEach(
	_eachArray: typeof eachArray,
	_eachObj: typeof eachObj,
	obj: object | IArray,
	callback: EachObjCallback | EachArrayCallback,
	own?: boolean
): false | number | string
export function doEach(
	_eachArray: typeof eachArray,
	_eachObj: typeof eachObj,
	obj: object | IArray,
	callback: EachObjCallback | EachArrayCallback,
	scope?: any,
	own?: boolean
): false | number | string
export function doEach(
	_eachArray: typeof eachArray,
	_eachObj: typeof eachObj,
	obj: any,
	callback: any,
	scope?: any,
	own?: boolean
): false | number | string {
	if (isArrayLike(obj)) return _eachArray(obj, callback, scope)
	return _eachObj(obj, callback, scope, own)
}

/**
 * each
 * - will stop each on callback return STOP
 * @param obj		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		each own properties on object, default: true
 * @return stoped index or false
 */

export function each(obj: IArray, callback: EachArrayCallback, scope?: any): false | number
export function each(obj: object, callback: EachObjCallback, own?: boolean): false | string
export function each(obj: object, callback: EachObjCallback, scope?: any, own?: boolean): false | string
export function each(
	obj: object | IArray,
	callback: EachObjCallback | EachArrayCallback,
	own?: boolean
): false | number | string
export function each(
	obj: object | IArray,
	callback: EachObjCallback | EachArrayCallback,
	scope?: any,
	own?: boolean
): false | number | string
export function each(obj: any, callback: any, scope?: any, own?: boolean): false | number | string {
	return doEach(eachArray, eachObj, obj, callback, scope, own)
}
