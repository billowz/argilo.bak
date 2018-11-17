// @flow
/**
 * @module helper/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 18:57:20 GMT+0800 (China Standard Time)
 */

import { STOP, eachArray, reachArray, eachObj } from './each'
import create from '../create'
import { bind } from '../fn'
import { hasOwnProp } from '../prop'
import { isArrayLike, isStr, isBool } from '../is'

import type { PseudoArray } from './each'

/**
 * SKIP Command
 * > ignore item on map
 * @constant
 */
export const SKIP = new String('SKIP')

/**
 * map callback on object
 * - will stop map on return STOP
 * - will ignore item on return SKIP
 * @callback MapObjCallback
 * @param  {any} 				value	property value
 * @param  {string} 			prop	property name
 * @param  {Object}				obj		map target
 * @returns {any}
 */
export type MapObjCallback = (value: any, prop: string, obj: Object) => any

export function mkMapObj(
	eachObj: typeof eachObj
): (obj: Object, callback: MapObjCallback, scope?: any, own?: boolean) => Object {
	return function mapObj(obj, callback, scope, own) {
		if (isBool(scope)) {
			own = scope
		} else {
			callback = bind(callback, scope)
		}
		const copy = create(null)
		eachObj(
			obj,
			(value, prop, obj) => {
				value = callback(value, prop, obj)
				if (value === STOP) return value
				if (value !== SKIP) copy[prop] = value
			},
			null,
			own
		)
		return copy
	}
}

/**
 * map callback on array or pseudo-array
 * - will stop map on return STOP
 * - will ignore item on return SKIP
 * @callback MapArrayCallback
 * @param  {any} 					data	item data
 * @param  {string|number} 			index	item index
 * @param  {Object|PseudoArray}		obj		map target
 * @returns {any}
 */
export type MapArrayCallback = (data: any, index: number, obj: PseudoArray) => any

export function mkMapArray(
	eachArray: typeof eachArray
): (array: PseudoArray, callback: MapArrayCallback, scope?: any) => Array<any> {
	return function(array, callback, scope) {
		callback = bind(callback, scope)
		const copy = []
		let j = 0
		eachArray(array, (data, index, array) => {
			data = callback(data, index, array)
			if (data === STOP) return data
			if (data !== SKIP) copy[j++] = data
		})
		return copy
	}
}

/**
 * map callback
 * - will stop map on return STOP
 * - will ignore item on return SKIP
 * @callback MapCallback
 * @param  {any} 					data	item data
 * @param  {string|number} 			index	item index
 * @param  {Object|PseudoArray}		obj		map target
 * @returns {any}
 */
export type MapCallback = (data: any, index: string | number, obj: Object | PseudoArray) => any

export function mkMap(
	mapArray: MapArray,
	mapObj: MapObj
): (
	obj: Object | PseudoArray,
	callback: MapObjCallback & MapArrayCallback,
	scope?: any,
	own?: boolean
) => Object | Array<any> {
	return function map(obj, callback, scope, own) {
		if (isArrayLike(obj)) return mapArray((obj: PseudoArray), callback, scope)
		return mapObj((obj: any), callback, scope, own)
	}
}

/**
 * map object
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @function
 * @param  {Object} 		obj			map target
 * @param  {MapObjCallback} callback	value callback
 * @param  {Object} 		[scope]		scope of callback
 * @param  {boolean} 		[own=true]	map own properties
 * @returns {Object}
 */
export const mapObj: (obj: Object, callback: MapObjCallback, scope?: any, own?: boolean) => Object = mkMapObj(eachObj)

/**
 * map array
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @function
 * @param  {PseudoArray}		array		map target: array or pseudo-array
 * @param  {MapArrayCallback} 	callback	value callback
 * @param  {any} 				[scope]		scope of callback
 * @return {Array}
 */
export const mapArray: (array: PseudoArray, callback: MapArrayCallback, scope?: any) => Array<any> = mkMapArray(
	eachArray
)

/**
 * revice map array
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @function
 * @param  {PseudoArray}		array		map target: array or pseudo-array
 * @param  {MapArrayCallback} 	callback	value callback
 * @param  {any} 				[scope]		scope of callback
 * @return {Array}
 */
export const rmapArray: (array: PseudoArray, callback: MapArrayCallback, scope?: any) => Array<any> = mkMapArray(
	reachArray
)

/**
 * map
 * - will stop map on callback return STOP
 * - will ignore item on callback return SKIP
 * @function
 * @param  {Object|PseudoArray} 				obj			map target
 * @param  {MapArrayCallback|MapArrayCallback} 	callback	value callback
 * @param  {Object} 							[scope]		scope of callback
 * @param  {boolean} 							[own=true]	map own properties on object
 * @returns {Object|Array}
 */
export const map: (
	obj: Object | PseudoArray,
	callback: MapObjCallback & MapArrayCallback,
	scope?: any,
	own?: boolean
) => Object | Array<any> = mkMap(mapArray, mapObj)
