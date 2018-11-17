// @flow
/**
 * @module observer/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Nov 16 2018 16:29:04 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:24:39 GMT+0800 (China Standard Time)
 */
import { $eachArray } from './each'
import { mkArr2Obj, isStr } from '../../helper'

import type { PseudoArray, arr2obj, Arr2ObjCallback } from '../../helper'

/**
 * @function
 * @see {arr2obj}
 */
export const $arr2obj: typeof arr2obj = mkArr2Obj($eachArray)

/**
 * convert array or pseudo-array to map
 * @param  {PseudoArray} 			arr
 * @param  {Arr2ObjCallback|any} 	[val]	value or callback
 * @param  {string} 				[split]	split char on string
 * @returns {Object}
 */
export function $makeMap(arr: PseudoArray, val?: Arr2ObjCallback | any, split?: string): Object {
	if (isStr(arr)) arr = (arr: any).split(split || ',')
	return $arr2obj(arr, ((isFn(val) ? val : data => [data, val]): any))
}
