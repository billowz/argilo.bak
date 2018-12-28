/**
 * prop utilities
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Thu Dec 27 2018 19:23:34 GMT+0800 (China Standard Time)
 */
import { PROTO, PROTOTYPE, HAS_OWN_PROP } from './consts'
import { protoProp } from './proto'

//========================================================================================
/*                                                                                      *
 *                                     own property                                     *
 *                                                                                      */
//========================================================================================

const __hasOwn = Object[PROTOTYPE][HAS_OWN_PROP]

/**
 * has own property
 */
export const hasOwnProp: (obj: any, prop: string) => boolean = protoProp
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

//========================================================================================
/*                                                                                      *
 *                                    define property                                   *
 *                                                                                      */
//========================================================================================

const { __defineGetter__, __defineSetter__ } = Object[PROTOTYPE] as any

let __defProp: (o: any, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>) => any = Object.defineProperty

/**
 * whether to support Object.defineProperty
 */
export const propDescriptor: boolean =
	__defProp &&
	!!(function() {
		try {
			var val: number,
				obj: { s?: number } = {}
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

/**
 * whether to support `__defineGetter__` and `__defineSetter__`
 */
export const propAccessor: boolean = propDescriptor || !!__defineSetter__

if (!propDescriptor)
	__defProp = __defineSetter__
		? function defineProperty(obj, prop, desc) {
				const { get, set } = desc
				if ('value' in desc || !(prop in obj)) obj[prop] = desc.value
				if (get) __defineGetter__.call(obj, prop, get)
				if (set) __defineSetter__.call(obj, prop, set)
				return obj
		  }
		: function defineProperty(obj, prop, desc) {
				if (desc.get || desc.set)
					throw new TypeError('Invalid property descriptor. Accessor descriptors are not supported.')
				if ('value' in desc || !(prop in obj)) obj[prop] = desc.value
				return obj
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
) => V = propDescriptor
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
