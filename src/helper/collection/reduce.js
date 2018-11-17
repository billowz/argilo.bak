// @flow
/**
 * @module helper/collection/reduce
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 18:58:31 GMT+0800 (China Standard Time)
 */

import { STOP, eachArray, reachArray, eachObj } from './each'
import create from '../create'
import { bind } from '../fn'
import { hasOwnProp } from '../prop'
import { isArrayLike, isStr, isBool } from '../is'

import type { PseudoArray } from './each'

/**
 * reduce callback on object
 * - will stop reduce on return STOP
 * @callback ReduceObjCallback
 * @param  {any} 				accumulator		accumulator
 * @param  {any} 				value			property value
 * @param  {string} 			prop			property name
 * @param  {Object}				obj				reduce target
 * @returns {any}
 */
export type ReduceObjCallback = (accumulator: any, value: any, prop: string, obj: Object) => any

export function mkReduceObj(
	eachObj: typeof eachObj
): (obj: Object, accumulator: any, callback: ReduceObjCallback, scope?: any, own?: boolean) => any {
	return function reduceObj(obj, accumulator, callback, scope, own) {
		if (isBool(scope)) {
			own = scope
		} else {
			callback = bind(callback, scope)
		}
		eachObj(
			obj,
			(value, prop, obj) => {
				const rs = callback(accumulator, value, prop, obj)
				if (rs === STOP) return STOP
				accumulator = rs
			},
			null,
			own
		)
		return accumulator
	}
}

/**
 * reduce callback on array or pseudo-array
 * - will stop reduce on return STOP
 * @callback ReduceArrayCallback
 * @param  {any} 					data	item data
 * @param  {string|number} 			index	item index
 * @param  {Object|PseudoArray}		obj		reduce target
 * @returns {any}
 */
export type ReduceArrayCallback = (accumulator: any, data: any, index: number, obj: PseudoArray) => any

export function mkReduceArray(
	eachArray: typeof eachArray
): (array: PseudoArray, accumulator: any, callback: ReduceArrayCallback, scope?: any) => any {
	return function(array, accumulator, callback, scope) {
		callback = bind(callback, scope)
		eachArray(array, (data, index, array) => {
			const rs = callback(accumulator, data, index, array)
			if (rs === STOP) return STOP
			accumulator = rs
		})
		return accumulator
	}
}

export function mkReduce(
	reduceArray: ReduceArray,
	reduceObj: ReduceObj
): (
	obj: Object | PseudoArray,
	accumulator: any,
	callback: ReduceArrayCallback & ReduceObjCallback,
	scope?: any,
	own?: boolean
) => any {
	return function reduce(obj, accumulator, callback, scope, own) {
		if (isArrayLike(obj))
			return reduceArray((obj: PseudoArray), accumulator, (callback: ReduceArrayCallback), scope)
		return reduceObj((obj: any), accumulator, (callback: ReduceObjCallback), scope, own)
	}
}

/**
 * reduce object
 * - will stop reduce on callback return STOP
 * @function
 * @param  {Object} 			obj			reduce target
 * @param  {any}				accumulator	accumulator
 * @param  {ReduceObjCallback} 	callback	value callback
 * @param  {Object} 			[scope]		scope of callback
 * @param  {boolean} 			[own=true]	reduce own properties
 * @returns {Object}
 */
export const reduceObj: (
	obj: Object,
	accumulator: any,
	callback: ReduceObjCallback,
	scope?: any,
	own?: boolean
) => any = mkReduceObj(eachObj)

/**
 * reduce array
 * - will stop reduce on callback return STOP
 * @function
 * @param  {PseudoArray}			array		reduce target: array or pseudo-array
 * @param  {any}					accumulator	accumulator
 * @param  {ReduceArrayCallback} 	callback	value callback
 * @param  {any} 					[scope]		scope of callback
 * @return {Array}
 */
export const reduceArray: (
	array: PseudoArray,
	accumulator: any,
	callback: ReduceArrayCallback,
	scope?: any
) => any = mkReduceArray(eachArray)

/**
 * revice reduce array
 * - will stop reduce on callback return STOP
 * @function
 * @param  {PseudoArray}			array		reduce target: array or pseudo-array
 * @param  {any}					accumulator	accumulator
 * @param  {ReduceArrayCallback} 	callback	value callback
 * @param  {any} 					[scope]		scope of callback
 * @return {Array}
 */
export const rreduceArray: (
	array: PseudoArray,
	accumulator: any,
	callback: ReduceArrayCallback,
	scope?: any
) => any = mkReduceArray(reachArray)

/**
 * reduce
 * - will stop reduce on callback return STOP
 * @function
 * @param  {Object|PseudoArray} 					obj			reduce target
 * @param  {any}									accumulator	accumulator
 * @param  {ReduceArrayCallback|ReduceObjCallback} 	callback	value callback
 * @param  {Object} 								[scope]		scope of callback
 * @param  {boolean} 								[own=true]	reduce own properties of reduce object
 * @returns {Object|Array}
 */
export const reduce: (
	obj: Object | PseudoArray,
	accumulator: any,
	callback: ReduceArrayCallback & ReduceObjCallback,
	scope?: any,
	own?: boolean
) => any = mkReduce(reduceArray, reduceObj)
