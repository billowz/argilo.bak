/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Fri Nov 16 2018 16:29:04 GMT+0800 (China Standard Time)
 * @modified Thu Apr 04 2019 19:38:40 GMT+0800 (China Standard Time)
 */

import { Control } from './Control'
import { eachArray } from './each'
import { IArray } from '../consts'
import { bind } from '../fn'
import { isFn, isStr, isArray } from '../is'
import { create } from '../create'

/**
 * @return STOP or SKIP or [key: string, value: any]
 */
export type Arr2ObjCallback<E, T> = (data: E, index: number, array: IArray<E>) => Control | [string, T]

export function doArr2Obj<E, T>(
	each: typeof eachArray,
	array: IArray<E>,
	callback: Arr2ObjCallback<E, T>,
	scope?: any
): { [key: string]: T } {
	const obj: { [key: string]: T } = create(null)
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
export function arr2obj<E, T>(array: IArray<E>, callback: Arr2ObjCallback<E, T>, scope?: any): { [key: string]: T } {
	return doArr2Obj(eachArray, array, callback, scope)
}

/**
 * convert array or string to object
 * @param array
 * @param val	value or callback
 * @param split	split char on string
 */
export function makeMap<E, T>(array: IArray<E>, val: Arr2ObjCallback<E, T>, split?: string): { [key: string]: T }
export function makeMap<E, T>(array: IArray<E>, val?: T, split?: string): { [key: string]: T }
export function makeMap(array: any, val?: any, split?: string) {
	if (isStr(array)) array = (array as string).split(isStr(split) ? split : ',')
	return arr2obj(array, isFn(val) ? val : data => [data, val])
}
