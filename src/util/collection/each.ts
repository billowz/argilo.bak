/**
 * @module util/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 09:49:19 GMT+0800 (China Standard Time)
 */
import { Control } from './Control'
import { IArray } from '../consts'
import { bind } from '../fn'
import { hasOwnProp } from '../ownProp'
import { isArrayLike, isBool } from '../is'
import { DKeyMap } from '../dkeys'

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
export type EachPropCallback<T extends {}> = (prop: string, obj: T) => Control | void

/**
 * each properties
 * - will stop each on callback return STOP
 * @param obj		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		each own properties, default: true
 * @return stoped property name or false
 */
export function eachProps<T extends {}>(obj: T, callback: EachPropCallback<T>, own: boolean): false | string
export function eachProps<T extends {}>(
	obj: T,
	callback: EachPropCallback<T>,
	scope?: any,
	own?: boolean
): false | string
export function eachProps<T extends {}>(
	obj: T,
	callback: EachPropCallback<T>,
	scope?: any,
	own?: boolean
): false | string {
	if (isBool(scope)) {
		own = scope
	} else {
		callback = bind(callback, scope)
	}
	let k: string
	if (own === false) {
		for (k in obj) if (!DKeyMap[k] && callback(k, obj) === STOP) return k
	} else {
		for (k in obj) if (!DKeyMap[k] && hasOwnProp(obj, k) && callback(k, obj) === STOP) return k
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
export type EachObjCallback<E> = (value: E, prop: string, obj: { [key: string]: E }) => Control | void

/**
 * each object
 * - will stop each on callback return STOP
 * @param obj		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @param own		each own properties, default: true
 * @return stoped property name or false
 */
export function eachObj<E>(obj: { [key: string]: E }, callback: EachObjCallback<E>, own: boolean): false | string
export function eachObj<E>(
	obj: { [key: string]: E },
	callback: EachObjCallback<E>,
	scope?: any,
	own?: boolean
): false | string
export function eachObj<E>(
	obj: { [key: string]: E },
	callback: EachObjCallback<E>,
	scope?: any,
	own?: boolean
): false | string {
	const args = arguments
	if (isBool(scope)) {
		own = scope
	} else {
		callback = bind(callback, scope)
	}
	let k: string
	if (own === false) {
		for (k in obj) if (!DKeyMap[k] && callback(obj[k], k, obj) === STOP) return k
	} else {
		for (k in obj) if (!DKeyMap[k] && hasOwnProp(obj, k) && callback(obj[k], k, obj) === STOP) return k
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
export type EachArrayCallback<E> = (data: E, index: number, array: IArray<E>) => Control | void

/**
 * each array
 * - will stop each on callback return STOP
 * @param array		each target
 * @param callback	callback
 * @param scope		scope of callback
 * @return stoped index or false
 */
export function eachArray<E>(array: IArray<E>, callback: EachArrayCallback<E>, scope?: any): false | number {
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
export function reachArray<E>(array: IArray<E>, callback: EachArrayCallback<E>, scope?: any): false | number {
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

export function doEach<E>(
	_eachArray: typeof eachArray,
	_eachObj: typeof eachObj,
	obj: IArray<E>,
	callback: EachArrayCallback<E>,
	scope?: any
): false | number
export function doEach<E>(
	_eachArray: typeof eachArray,
	_eachObj: typeof eachObj,
	obj: { [key: string]: E },
	callback: EachObjCallback<E>,
	own?: boolean
): false | string
export function doEach<E>(
	_eachArray: typeof eachArray,
	_eachObj: typeof eachObj,
	obj: { [key: string]: E },
	callback: EachObjCallback<E>,
	scope?: any,
	own?: boolean
): false | string
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

export function each<E>(obj: IArray<E>, callback: EachArrayCallback<E>, scope?: any): false | number
export function each<E>(obj: { [key: string]: E }, callback: EachObjCallback<E>, own?: boolean): false | string
export function each<E>(
	obj: { [key: string]: E },
	callback: EachObjCallback<E>,
	scope?: any,
	own?: boolean
): false | string
export function each<E>(obj: any, callback: any, scope?: any, own?: boolean): false | number | string {
	return doEach(eachArray, eachObj, obj, callback, scope, own)
}
