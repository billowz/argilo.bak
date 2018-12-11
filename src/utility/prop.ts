/**
 * prop utilities
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Mon Dec 10 2018 12:44:40 GMT+0800 (China Standard Time)
 */
import { PROTO, PROTOTYPE } from './consts'
import { protoPropSupport } from './proto'

const __hasOwn = Object[PROTOTYPE].hasOwnProperty

/**
 * has own property
 */
export const hasOwnProp: (obj: any, prop: string) => boolean = protoPropSupport
	? function hasOwnProp(obj: any, prop: string): boolean {
			return __hasOwn.call(obj, prop)
	  }
	: function hasOwnProp(obj: any, prop: string): boolean {
			return prop !== PROTO && __hasOwn.call(obj, prop)
	  }

/**
 * get owner property value
 * @param prop 			property name
 * @param defaultVal 	default value
 */
export function getOwnProp(obj: any, prop: string, defaultVal?: any): any {
	return hasOwnProp(obj, prop) ? obj[prop] : defaultVal
}

let __defProp = Object.defineProperty
/**
 * is support Object.defineProperty
 */
export const defPropSupport: boolean =
	__defProp &&
	(function() {
		try {
			var val,
				obj: any = {}
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
	__defProp = function defineProperty(
		obj: any,
		prop: string | number | symbol,
		desc: PropertyDescriptor & ThisType<any>
	): any {
		if (desc.get || desc.set) {
			throw new Error('not support getter/setter on defineProperty')
		}
		obj[prop] = desc.value
		return obj
	}
}

/**
 * define property
 */
export const defProp = __defProp

/**
 * define property by value
 */
export const defPropValue: <V>(
	obj: any,
	prop: string,
	value: V,
	enumerable?: boolean,
	configurable?: boolean,
	writable?: boolean
) => V = defPropSupport
	? function defPropValue(obj, prop, value, configurable, writable, enumerable) {
			__defProp(obj, prop, {
				value,
				enumerable: enumerable !== false,
				configurable: configurable !== false,
				writable: writable !== false
			})
			return value
	  }
	: function defPropValue(obj, prop, value) {
			obj[prop] = value
			return value
	  }
