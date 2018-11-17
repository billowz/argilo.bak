// @flow
/**
 * @module observer/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 18:45:31 GMT+0800 (China Standard Time)
 */

import { proxy, $hasOwnProp, isDefaultProp } from '../observer'
import { STOP, bind, isArrayLike, isStr, isBool } from '../../helper'

import type { PseudoArray, EachPropCallback, EachObjCallback, EachArrayCallback } from '../../helper'

/**
 * each properties
 * - will stop each on callback return STOP
 * @param  {Object} 			obj			each target
 * @param  {EachPropCallback} 	callback	callback
 * @param  {any} 				[scope]		scope of callback
 * @param  {boolean} 			[own=true]	each own properties
 * @returns {false|string} not stop or stoped property name
 */
export function $eachProps(obj: Object, callback: EachPropCallback, scope?: any, own?: boolean): false | string {
	if (isBool(scope)) {
		own = scope
	} else {
		callback = bind(callback, scope)
	}
	let k: string
	if (own === false) {
		for (k in obj) if (!isDefaultProp(k) && callback(k, obj) === STOP) return k
	} else {
		for (k in obj) if ($hasOwnProp(obj, k) && callback(k, obj) === STOP) return k
	}
	return false
}

/**
 * each object
 * - will stop each on callback return STOP
 * @param  {Object} 			obj			each target
 * @param  {EachObjCallback}	callback	callback
 * @param  {any} 				[scope]		scope of callback
 * @param  {boolean} 			[own=true]	each own properties
 * @returns {false|string} not stop or stoped property name
 */
export function $eachObj(obj: Object, callback: EachObjCallback, scope?: any, own?: boolean): false | string {
	const args = arguments
	if (isBool(scope)) {
		own = scope
	} else {
		callback = bind(callback, scope)
	}
	let k: string
	if (own === false) {
		for (k in obj) if (!isDefaultProp(k) && callback(proxy(obj[k]), k, obj) === STOP) return k
	} else {
		for (k in obj) if ($hasOwnProp(obj, k) && callback(proxy(obj[k]), k, obj) === STOP) return k
	}
	return false
}

/**
 * each array
 * - will stop each on callback return STOP
 * @param  {PseudoArray}		array		each target: array or pseudo-array
 * @param  {EachArrayCallback} 	callback	callback
 * @param  {any} 				[scope]		scope of callback
 * @returns {false|number} not stop or stoped index
 */
export function $eachArray(array: PseudoArray, callback: EachArrayCallback, scope?: any): false | number {
	callback = bind(callback, scope)
	for (let i = 0, l = array.length; i < l; i++) if (callback(proxy((array: any)[i]), i, array) === STOP) return i
	return false
}

/**
 * reverse each array
 * - will stop each on callback return STOP
 * @param  {PseudoArray}		array		each target: array or pseudo-array
 * @param  {EachArrayCallback} 	callback	callback
 * @param  {any} 				[scope]		scope of callback
 * @returns {false|number} not stop or stoped index
 */
export function $reachArray(array: PseudoArray, callback: EachArrayCallback, scope?: any): false | number {
	callback = bind(callback, scope)
	let i = array.length
	while (i--) if (callback(proxy((array: any)[i]), i, array) === STOP) return i
	return false
}

/**
 * each
 * - will stop each on callback return STOP
 * @param  {Object|PseudoArray} 					obj			each target
 * @param  {EachObjCallback|EachArrayCallback} 		callback	callback
 * @param  {any} 									[scope]		scope of callback
 * @param  {boolean} 								[own=true]	each own properties on object
 * @returns {false|number|string} not stop or stoped index
 */
export function $each(
	obj: Object | PseudoArray,
	callback: EachObjCallback & EachArrayCallback,
	scope?: any,
	own?: boolean
): false | number | string {
	if (isArrayLike(obj)) return $eachArray((obj: any), callback, scope)
	return $eachObj((obj: any), callback, scope, own)
}
