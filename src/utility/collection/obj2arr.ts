/**
 * @module utility/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Jul 26 2018 10:47:47 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 19:34:56 GMT+0800 (China Standard Time)
 */
import { Control } from './Control'
import { STOP, eachObj, eachProps } from './each'
import { SKIP } from './map'
import { isBool, isFn } from '../is'
import { bind } from '../fn'

//========================================================================================
/*                                                                                      *
 *                                         keys                                         *
 *                                                                                      */
//========================================================================================

export type ObjKeyHandler<T> = (prop: string, obj: object) => T | Control

function defaultObjKeyHandler(prop: string, obj: object): any {
	return prop
}
export function doObjKeys<T>(each: typeof eachProps, obj: object, own?: boolean): T[]
export function doObjKeys<T>(each: typeof eachProps, obj: object, callback: ObjKeyHandler<T>, own?: boolean): T[]
export function doObjKeys<T>(
	each: typeof eachProps,
	obj: object,
	callback: ObjKeyHandler<T>,
	scope?: any,
	own?: boolean
): T[]
export function doObjKeys<T>(
	each: typeof eachProps,
	obj: object,
	callback_own?: ObjKeyHandler<T> | boolean,
	scope_own?: any,
	own?: boolean
): T[]
export function doObjKeys<T>(each: typeof eachProps, obj: object): T[] {
	const rs: T[] = [],
		args = arguments
	let handler: ObjKeyHandler<T> = defaultObjKeyHandler,
		i = 2,
		j = 0
	if (isFn(args[i])) {
		handler = args[i++]
		if (!isBool(args[i])) handler = bind(handler, args[i++])
	}
	each(
		obj,
		(prop, obj) => {
			const val = handler(prop, obj)
			if (val === STOP) return STOP
			if (val !== SKIP) rs[j++] = val as T
		},
		null,
		args[i]
	)
	return rs
}

/**
 * @param obj		target
 * @param handler	key handler
 * @param scope		scope or handler
 * @param own		is get own properties, default: true
 */
export function keys<T>(obj: object, own?: boolean): T[]
export function keys<T>(obj: object, callback: ObjKeyHandler<T>, own?: boolean): T[]
export function keys<T>(obj: object, callback: ObjKeyHandler<T>, scope?: any, own?: boolean): T[]
export function keys<T>(obj: object, callback?: ObjKeyHandler<T> | boolean, scope?: any, own?: boolean): T[] {
	return doObjKeys(eachProps, obj, callback, scope, own)
}

//========================================================================================
/*                                                                                      *
 *                                        values                                        *
 *                                                                                      */
//========================================================================================

export type ObjValueHandler<T> = (value: any, prop: string, obj: object) => T | Control

function defaultObjValueHandler(value: any, prop: string, obj: object): any {
	return value
}
export function doObjValues<T>(each: typeof eachObj, obj: object, own?: boolean): T[]
export function doObjValues<T>(each: typeof eachObj, obj: object, callback: ObjValueHandler<T>, own?: boolean): T[]
export function doObjValues<T>(
	each: typeof eachObj,
	obj: object,
	callback: ObjValueHandler<T>,
	scope?: any,
	own?: boolean
): T[]
export function doObjValues<T>(
	each: typeof eachObj,
	obj: object,
	callback_own?: ObjValueHandler<T> | boolean,
	scope_own?: any,
	own?: boolean
): T[]
export function doObjValues<T>(each: typeof eachObj, obj: object): T[] {
	const rs: T[] = [],
		args = arguments
	let handler: ObjValueHandler<T> = defaultObjValueHandler,
		i = 1,
		j = 0
	if (isFn(args[i])) {
		handler = args[i++]
		if (!isBool(args[i])) handler = bind(handler, args[i++])
	}
	each(
		obj,
		function(data, prop, obj) {
			const val = handler(data, prop, obj)
			if (val === STOP) return STOP
			if (val !== SKIP) rs[j++] = val as T
		},
		null,
		args[i]
	)
	return rs
}

/**
 * @param obj		target
 * @param handler	value handler
 * @param scope		scope or handler
 * @param own		is get own properties, default: true
 */
export function values<T>(obj: object, own?: boolean): T[]
export function values<T>(obj: object, callback: ObjValueHandler<T>, own?: boolean): T[]
export function values<T>(obj: object, callback: ObjValueHandler<T>, scope?: any, own?: boolean): T[]
export function values<T>(obj: object, callback?: ObjValueHandler<T> | boolean, scope?: any, own?: boolean): T[] {
	return doObjValues(eachObj, obj, callback, scope, own)
}
