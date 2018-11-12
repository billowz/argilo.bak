// @flow
/**
 * @module helper/defProp
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Aug 23 2018 15:15:08 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 17:17:03 GMT+0800 (China Standard Time)
 */

import { assert } from 'devlevel'

let __defProp = Object.defineProperty
/**
 * is support Object.defineProperty
 * @constant {boolean}
 * @static
 * @name defPropSupport
 */
export const defPropSupport: boolean =
	__defProp &&
	(function() {
		try {
			var val,
				obj = {}
			__defProp(obj, 's', {
				get() {
					return val
				},
				set(value) {
					val = value
				}
			})
			obj.s = 1
			return obj.s === val
		} catch (e) {}
	})()
if (!defPropSupport) {
	__defProp = function defineProperty<T>(obj: T, prop: string, desc: Object): T {
		assert(desc.get || desc.set, 'not support getter/setter on defineProperty')
		obj[prop] = desc.value
		return obj
	}
}

/**
 * Object.defineProperty shim
 * @function defProp
 * @static
 * @param  {T} obj
 * @param  {string} prop
 * @param  {Object} desc
 * @returns {T}
 */
export const defProp: <T>(obj: T, prop: string, desc: Object) => T = __defProp

/**
 * define property by value
 * @function defPropValue
 * @static
 * @param  {any} obj
 * @param  {string} prop
 * @param  {T} value
 * @param  {boolean} configurable?
 * @param  {boolean} writeable?
 * @param  {boolean} enumerable?
 * @returns {T}
 */
export const defPropValue: <T>(
	obj: any,
	prop: string,
	value: T,
	configurable?: boolean,
	writeable?: boolean,
	enumerable?: boolean
) => T = defPropSupport
	? function defPropValue<T>(
			obj: any,
			prop: string,
			value: T,
			configurable?: boolean,
			writeable?: boolean,
			enumerable?: boolean
	  ): T {
			__defProp(obj, prop, {
				value,
				configurable: configurable || false,
				writeable: writeable || false,
				enumerable: enumerable || false
			})
			return value
	  }
	: function defPropValue(obj: any, prop: string, value: T): T {
			obj[prop] = value
			return value
	  }
