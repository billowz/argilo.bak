// @flow
/**
 * prop utilities
 * @module helper/prop
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 12:07:18 GMT+0800 (China Standard Time)
 */
import { assert } from 'devlevel'
import { PROTOTYPE } from './consts'

const __hasOwn = Object[PROTOTYPE].hasOwnProperty

/**
 * Object.prototype.hasOwnProperty proxy
 * @param  {any} obj
 * @param  {string} prop
 * @returns {boolean}
 */
export function hasOwnProp(obj: any, prop: string): boolean {
	return __hasOwn.call(obj, prop)
}

/**
 * get owner property value
 * @param  {any} obj
 * @param  {string} prop		property name
 * @param  {any} defaultVal? 	default value
 * @returns {any}
 */
export function getOwnProp(obj: any, prop: string, defaultVal?: any): any {
	return obj && __hasOwn.call(obj, prop) ? obj[prop] : defaultVal
}

let __defProp = Object.defineProperty
/**
 * is support Object.defineProperty
 * @constant {boolean}
 * @static
 * @name defPropSupport
 */
export const defPropSupport: boolean =
	__defProp &&
	(function(): any {
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
	__defProp = function defineProperty(obj: any, prop: string, desc: Object): any {
		assert(desc.get || desc.set, 'not support getter/setter on defineProperty')
		obj[prop] = desc.value
		return obj
	}
}

/**
 * Object.defineProperty shim
 * @function defProp
 * @static
 * @param  {T} 			obj
 * @param  {string} 	prop
 * @param  {Object} 	desc
 * @param  {boolean} 	[desc.configurable=false]
 * @param  {boolean} 	[desc.enumerable=false]
 * @param  {boolean} 	[desc.writable=false]
 * @param  {any} 		[desc.value]
 * @param  {Function} 	[desc.get]
 * @param  {Function} 	[desc.set]
 * @returns {T}
 */
export const defProp: <T>(
	obj: T,
	prop: string,
	desc: {
		configurable?: boolean,
		enumerable?: boolean,
		writable?: boolean,
		value?: any,
		get?: Function,
		set?: Function
	}
) => T = __defProp

/**
 * define property by value
 * @function defPropValue
 * @static
 * @param  {any} 		obj
 * @param  {string} 	prop
 * @param  {any} 		value
 * @param  {boolean} 	[configurable=false]
 * @param  {boolean} 	[writeable=false]
 * @param  {boolean} 	[enumerable=false]
 * @returns {any}
 */
export const defPropValue: (
	obj: any,
	prop: string,
	value: any,
	configurable?: boolean,
	writeable?: boolean,
	enumerable?: boolean
) => any = defPropSupport
	? function defPropValue(obj, prop, value, configurable, writeable, enumerable) {
			__defProp(obj, prop, {
				value,
				configurable: configurable || false,
				writeable: writeable || false,
				enumerable: enumerable || false
			})
			return value
	  }
	: function defPropValue(obj, prop, value) {
			obj[prop] = value
			return value
	  }
