/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 14:02:39 GMT+0800 (China Standard Time)
 */
import { Control } from './control'
import { STOP, eachArray, reachArray, eachObj } from './each'
import { IArray } from '../consts'
import { bind } from '../fn'
import { isArrayLike, isBool } from '../is'

//========================================================================================
/*                                                                                      *
 *                                     reduce object                                    *
 *                                                                                      */
//========================================================================================

/**
 * reduce callback on object
 * - will stop reduce on return STOP
 */
export type ReduceObjCallback<T> = (accumulator: T, value: any, prop: string, obj: object) => T | Control

export function doReduceObj<T>(
	each: typeof eachObj,
	obj: object,
	accumulator: T,
	callback: ReduceObjCallback<T>,
	own?: boolean
): T
export function doReduceObj<T>(
	each: typeof eachObj,
	obj: object,
	accumulator: T,
	callback: ReduceObjCallback<T>,
	scope?: any,
	own?: boolean
): T
export function doReduceObj<T>(
	each: typeof eachObj,
	obj: object,
	accumulator: T,
	callback: ReduceObjCallback<T>,
	scope?: any,
	own?: boolean
): T {
	if (isBool(scope)) {
		own = scope
	} else {
		callback = bind(callback, scope)
	}
	each(
		obj,
		(value, prop, obj) => {
			const rs = callback(accumulator, value, prop, obj)
			if (rs === STOP) return STOP
			accumulator = rs as T
		},
		null,
		own
	)
	return accumulator
}

/**
 * reduce object
 * - will stop reduce on callback return STOP
 * @param obj			reduce target
 * @param accumulator	accumulator
 * @param callback		value callback
 * @param scope			scope of callback
 * @param own			reduce own properties, default: true
 */
export function reduceObj<T>(obj: object, accumulator: T, callback: ReduceObjCallback<T>, own?: boolean)
export function reduceObj<T>(obj: object, accumulator: T, callback: ReduceObjCallback<T>, scope?: any, own?: boolean)
export function reduceObj<T>(
	obj: object,
	accumulator: T,
	callback: ReduceObjCallback<T>,
	scope?: any,
	own?: boolean
): T {
	return doReduceObj(eachObj, obj, accumulator, callback, scope, own)
}
//========================================================================================
/*                                                                                      *
 *                                     reduce array                                     *
 *                                                                                      */
//========================================================================================

/**
 * reduce callback on array
 * - will stop reduce on return STOP
 */
export type ReduceArrayCallback<T> = (accumulator: T, data: any, index: number, array: IArray) => T | Control

export function doReduceArray<T>(
	each: typeof eachArray,
	array: IArray,
	accumulator: T,
	callback: ReduceArrayCallback<T>,
	scope?: any
): T {
	callback = bind(callback, scope)
	each(array, (data, index, array) => {
		const rs = callback(accumulator, data, index, array)
		if (rs === STOP) return STOP
		accumulator = rs as T
	})
	return accumulator
}

/**
 * reduce array
 * - will stop reduce on callback return STOP
 * @param array			reduce target
 * @param accumulator	accumulator
 * @param callback		value callback
 * @param scope			scope of callback
 */
export function reduceArray<T>(array: IArray, accumulator: T, callback: ReduceArrayCallback<T>, scope?: any): T {
	return doReduceArray(eachArray, array, accumulator, callback, scope)
}

/**
 * revice reduce array
 * - will stop reduce on callback return STOP
 * @param array			reduce target
 * @param accumulator	accumulator
 * @param callback		value callback
 * @param scope			scope of callback
 */
export function rreduceArray<T>(array: IArray, accumulator: T, callback: ReduceArrayCallback<T>, scope?: any): T {
	return doReduceArray(reachArray, array, accumulator, callback, scope)
}

//========================================================================================
/*                                                                                      *
 *                                        reduce                                        *
 *                                                                                      */
//========================================================================================

export function doReduce<T>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: IArray,
	accumulator: T,
	callback: ReduceArrayCallback<T>,
	scope?: any
): T
export function doReduce<T>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object,
	accumulator: T,
	callback: ReduceObjCallback<T>,
	own?: boolean
): T
export function doReduce<T>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object,
	accumulator: T,
	callback: ReduceObjCallback<T>,
	scope?: any,
	own?: boolean
): T
export function doReduce<T>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object | IArray,
	accumulator: T,
	callback: ReduceObjCallback<T> | ReduceArrayCallback<T>,
	own?: boolean
): T
export function doReduce<T>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object | IArray,
	accumulator: T,
	callback: ReduceObjCallback<T> | ReduceArrayCallback<T>,
	scope?: any,
	own?: boolean
): T
export function doReduce<T>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: object | IArray,
	accumulator: T,
	callback: ReduceArrayCallback<T> | ReduceObjCallback<T>,
	scope?: any,
	own?: boolean
): T {
	if (isArrayLike(obj))
		return doReduceArray(eacharray, obj as IArray, accumulator, callback as ReduceArrayCallback<T>, scope)
	return doReduceObj(eachobj, obj as object, accumulator, callback as ReduceObjCallback<T>, scope, own)
}

/**
 * reduce
 * - will stop reduce on callback return STOP
 * @param obj			reduce target
 * @param accumulator	accumulator
 * @param callback		value callback
 * @param scope			scope of callback
 * @param own			reduce own properties of reduce object, default: true
 */
export function reduce<T>(obj: IArray, accumulator: T, callback: ReduceArrayCallback<T>, scope?: any): T
export function reduce<T>(obj: object, accumulator: T, callback: ReduceObjCallback<T>, own?: boolean): T
export function reduce<T>(obj: object, accumulator: T, callback: ReduceObjCallback<T>, scope?: any, own?: boolean): T
export function reduce<T>(
	obj: object | IArray,
	accumulator: T,
	callback: ReduceObjCallback<T> | ReduceArrayCallback<T>,
	own?: boolean
): T
export function reduce<T>(
	obj: object | IArray,
	accumulator: T,
	callback: ReduceObjCallback<T> | ReduceArrayCallback<T>,
	scope?: any,
	own?: boolean
): T
export function reduce<T>(
	obj: object | IArray,
	accumulator: T,
	callback: ReduceArrayCallback<T> | ReduceObjCallback<T>,
	scope?: any,
	own?: boolean
): T {
	return doReduce(eachArray, eachObj, obj, accumulator, callback, scope, own)
}
