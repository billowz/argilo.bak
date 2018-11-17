// @flow
/**
 * @module helper/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Nov 16 2018 16:29:04 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:24:25 GMT+0800 (China Standard Time)
 */

import { STOP, eachArray } from './each'
import { SKIP } from './map'
import create from '../create'
import { bind } from '../fn'
import { isFn, isStr } from '../is'

import type { PseudoArray, EachArrayCallback } from './each'

export type Arr2ObjCallback = (
	data: any,
	index: number,
	array: PseudoArray
) => typeof STOP | typeof SKIP | [string, any]

type Arr2Obj = (array: PseudoArray, callback: Arr2ObjCallback, scope?: any) => Object

export function mkArr2Obj(each: typeof eachArray): Arr2Obj {
	return function(array, callback, scope) {
		const obj = create(null)
		callback = bind(callback, scope)
		each(array, (data, index, array) => {
			const r: any = callback(data, index, array)
			if (r === STOP || r === SKIP) return r
			obj[r[0]] = r[1]
		})
		return obj
	}
}

/**
 * @param  {PseudoArray} 		array
 * @param  {Arr2ObjCallback} 	callback
 * @param  {any} 				[scope]
 * @returns {Object}
 */
export const arr2obj: Arr2Obj = mkArr2Obj(eachArray)

/**
 * convert array or pseudo-array to map
 * @param  {PseudoArray} 			arr
 * @param  {Arr2ObjCallback|any} 	[val]	value or callback
 * @param  {string} 				[split]	split char on string
 * @returns {Object}
 */
export function makeMap(arr: PseudoArray, val?: Arr2ObjCallback | any, split?: string): Object {
	if (isStr(arr)) arr = (arr: any).split(split || ',')
	return arr2obj(arr, ((isFn(val) ? val : data => [data, val]): any))
}
