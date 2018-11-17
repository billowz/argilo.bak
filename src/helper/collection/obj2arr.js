// @flow
/**
 * @module helper/collection
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Jul 26 2018 10:47:47 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 18:52:02 GMT+0800 (China Standard Time)
 */

import { STOP, eachObj, eachProps } from './each'
import { SKIP } from './map'
import { isBool, isFn } from '../is'
import { bind } from '../fn'

import type { EachPropCallback } from './each'

/**
 * @callback ObjKeyHandler
 * @param  {string} prop
 * @param  {Object} obj
 * @returns {any}
 */
export type ObjKeyHandler = (prop: string, obj: Object) => any

export function mkObjKeys(
	eachProps: typeof eachProps
): (obj: Object, handler_or_own?: boolean | ObjKeyHandler, scope_or_own?: any, own?: boolean) => Array<any> {
	return function keys(obj, handler_or_own, scope_or_own, own) {
		const rs = [],
			args = arguments
		let handler: ObjKeyHandler = defaultObjKeyHandler,
			i = 1,
			j = 0
		if (isFn(args[i])) {
			handler = args[i++]
			if (!isBool(args[i])) handler = bind(handler, args[i++])
		}
		eachProps(
			obj,
			(prop, obj) => {
				const val = handler(prop, obj)
				if (val === STOP) return STOP
				if (val !== SKIP) rs[j++] = val
			},
			null,
			args[i]
		)
		return rs
	}
}

/**
 * @callback ObjValueHandler
 * @param  {any} 	value
 * @param  {string} prop
 * @param  {Object} obj
 * @returns {any}
 */
export type ObjValueHandler = (value: any, prop: string, obj: Object) => any

export function mkObjValues(
	eachObj: typeof eachObj
): (obj: Object, handler_or_own?: boolean | ObjValueHandler, scope_or_own?: any, own?: boolean) => Array<any> {
	return function values(obj, handler_or_own, scope_or_own, own) {
		const rs = [],
			args = arguments
		let handler: ObjValueHandler = defaultObjValueHandler,
			i = 1,
			j = 0
		if (isFn(args[i])) {
			handler = args[i++]
			if (!isBool(args[i])) handler = bind(handler, args[i++])
		}
		eachObj(
			obj,
			function(data, prop, obj) {
				const val = handler(data, prop, obj)
				if (val === STOP) return STOP
				if (val !== SKIP) rs[j++] = val
			},
			null,
			args[i]
		)
		return rs
	}
}

/**
 * overrides:
 * - keys(obj: Object, own?: boolean)
 * - keys(obj: Object, handler: {ObjKeyHandler}, own?: boolean)
 * - keys(obj: Object, handler: {ObjKeyHandler}, scope?: any, own?: boolean)
 * @param  {Object} 			obj			target
 * @param  {ObjKeyHandler}		[handler]	key handler
 * @param  {any} 				[scope]		scope or handler
 * @param  {boolean} 			[own=true]	is get own properties
 * @returns {Array}
 */
export const keys: (
	obj: Object,
	handler_or_own?: boolean | ObjKeyHandler,
	scope_or_own?: any,
	own?: boolean
) => Array<any> = mkObjKeys(eachProps)

/**
 * overrides:
 * - values(obj: Object, own?: boolean)
 * - values(obj: Object, handler: {ObjValueHandler}, own?: boolean)
 * - values(obj: Object, handler: {ObjValueHandler}, scope?: any, own?: boolean)
 * @param  {Object} 			obj			target
 * @param  {ObjValueHandler}	[handler]	value handler
 * @param  {any} 				[scope]		scope or handler
 * @param  {boolean} 			[own=true]	is get own properties
 * @returns {Array}
 */
export const values: (
	obj: Object,
	handler_or_own?: boolean | ObjValueHandler,
	scope_or_own?: any,
	own?: boolean
) => Array<any> = mkObjValues(eachObj)

function defaultObjKeyHandler(prop: string, obj: Object): any {
	return prop
}

function defaultObjValueHandler(value: any, prop: string, obj: Object): any {
	return value
}
