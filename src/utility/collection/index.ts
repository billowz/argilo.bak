/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Nov 15 2018 12:13:54 GMT+0800 (China Standard Time)
 * @modified Thu Mar 28 2019 19:39:52 GMT+0800 (China Standard Time)
 */
import { Control } from './Control'
export { STOP, eachProps, eachArray, eachObj, each } from './each'
export { SKIP, mapArray, mapObj, map } from './map'
export { idxOfArray, idxOfObj, idxOf } from './idxOf'
export { reduceArray, reduceObj, reduce } from './reduce'
export { keys, values } from './obj2arr'
export { arr2obj, makeMap } from './arr2obj'

export function makeArray<T>(len: number, callback: (index: number) => T): T[] {
	const array = new Array(len)
	let i = len
	while (i--) array[i] = callback(i)
	return array
}
export type EachControl = Control
