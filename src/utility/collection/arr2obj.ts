/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Nov 16 2018 16:29:04 GMT+0800 (China Standard Time)
 * @modified Fri Dec 21 2018 14:09:44 GMT+0800 (China Standard Time)
 */

import { Control } from './control'
import { eachArray } from './each'
import { IArray } from '../consts'
import { bind } from '../fn'
import { isFn, isStr, isArray } from '../is'
import { create } from '../create'

/**
 * @return STOP or SKIP or [key: string, value: any]
 */
export type Arr2ObjCallback = (data: any, index: number, array: IArray) => Control | [string, any]

export function doArr2Obj(each: typeof eachArray, array: IArray, callback: Arr2ObjCallback, scope?: any): object {
	const obj = create(null)
	callback = bind(callback, scope)
	each(array, (data, index, array) => {
		const r: Control | [string, any] = callback(data, index, array)
		if (isArray(r)) {
			obj[r[0]] = r[1]
		} else {
			return r as Control
		}
	})
	return obj
}

/**
 * convert array to object
 */
export function arr2obj(array: IArray, callback: Arr2ObjCallback, scope?: any): object {
	return doArr2Obj(eachArray, array, callback, scope)
}

/**
 * convert array or string to object
 * @param array
 * @param val	value or callback
 * @param split	split char on string
 */
export function makeMap(array: IArray, val: Arr2ObjCallback, split?: string): object
export function makeMap(array: IArray, val?: any, split?: string): object
export function makeMap(array: IArray, val?: any, split?: string): object {
	if (isStr(array)) array = (array as string).split(isStr(split) ? split : ',')
	return arr2obj(array, isFn(val) ? val : data => [data, val])
}
