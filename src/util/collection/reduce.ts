/**
 * @module util/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Thu Apr 04 2019 19:30:27 GMT+0800 (China Standard Time)
 */
import { Control } from './Control'
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
export type ReduceObjCallback<T, E> = (accumulator: T, value: E, prop: string, obj: { [key: string]: E }) => T | Control

export function doReduceObj<T, E>(
	each: typeof eachObj,
	obj: { [key: string]: E },
	accumulator: T,
	callback: ReduceObjCallback<T, E>,
	own?: boolean
): T
export function doReduceObj<T, E>(
	each: typeof eachObj,
	obj: { [key: string]: E },
	accumulator: T,
	callback: ReduceObjCallback<T, E>,
	scope?: any,
	own?: boolean
): T
export function doReduceObj<T, E>(
	each: typeof eachObj,
	obj: { [key: string]: E },
	accumulator: T,
	callback: ReduceObjCallback<T, E>,
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
export function reduceObj<T, E>(
	obj: { [key: string]: E },
	accumulator: T,
	callback: ReduceObjCallback<T, E>,
	own?: boolean
)
export function reduceObj<T, E>(
	obj: { [key: string]: E },
	accumulator: T,
	callback: ReduceObjCallback<T, E>,
	scope?: any,
	own?: boolean
)
export function reduceObj<T, E>(
	obj: { [key: string]: E },
	accumulator: T,
	callback: ReduceObjCallback<T, E>,
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
export type ReduceArrayCallback<T, E> = (accumulator: T, data: E, index: number, array: IArray<E>) => T | Control

export function doReduceArray<T, E>(
	each: typeof eachArray,
	array: IArray<E>,
	accumulator: T,
	callback: ReduceArrayCallback<T, E>,
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
export function reduceArray<T, E>(
	array: IArray<E>,
	accumulator: T,
	callback: ReduceArrayCallback<T, E>,
	scope?: any
): T {
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
export function rreduceArray<T, E>(
	array: IArray<E>,
	accumulator: T,
	callback: ReduceArrayCallback<T, E>,
	scope?: any
): T {
	return doReduceArray(reachArray, array, accumulator, callback, scope)
}

//========================================================================================
/*                                                                                      *
 *                                        reduce                                        *
 *                                                                                      */
//========================================================================================

export function doReduce<T, E>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: IArray<E>,
	accumulator: T,
	callback: ReduceArrayCallback<T, E>,
	scope?: any
): T
export function doReduce<T, E>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: { [key: string]: E },
	accumulator: T,
	callback: ReduceObjCallback<T, E>,
	own?: boolean
): T
export function doReduce<T, E>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: { [key: string]: E },
	accumulator: T,
	callback: ReduceObjCallback<T, E>,
	scope?: any,
	own?: boolean
): T
export function doReduce<T, E>(
	eacharray: typeof eachArray,
	eachobj: typeof eachObj,
	obj: any,
	accumulator: T,
	callback: any,
	scope?: any,
	own?: boolean
): T {
	if (isArrayLike(obj)) return doReduceArray(eacharray, obj as IArray<E>, accumulator, callback, scope)
	return doReduceObj(eachobj, obj, accumulator, callback, scope, own)
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
export function reduce<T, E>(obj: IArray<E>, accumulator: T, callback: ReduceArrayCallback<T, E>, scope?: any): T
export function reduce<T, E>(
	obj: { [key: string]: E },
	accumulator: T,
	callback: ReduceObjCallback<T, E>,
	own?: boolean
): T
export function reduce<T, E>(
	obj: { [key: string]: E },
	accumulator: T,
	callback: ReduceObjCallback<T, E>,
	scope?: any,
	own?: boolean
): T
export function reduce<T, E>(obj: any, accumulator: T, callback: any, scope?: any, own?: boolean): T {
	return doReduce(eachArray, eachObj, obj, accumulator, callback, scope, own)
}
