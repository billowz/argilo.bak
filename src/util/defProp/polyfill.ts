/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 13:28:30 GMT+0800 (China Standard Time)
 */
import { P_PROTOTYPE } from '../consts'

const { __defineGetter__, __defineSetter__ } = Object[P_PROTOTYPE] as any
let $defProp: (o: any, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>) => any = Object.defineProperty

/**
 * whether to support Object.defineProperty
 * @constant
 */
export let propDescriptor: boolean = false
if ($defProp) {
	try {
		var val: number,
			obj: { s?: number } = {}
		$defProp(obj, 's', {
			get() {
				return val
			},
			set(value) {
				val = value
			}
		})
		obj.s = 1
		propDescriptor = obj.s === val
	} catch (e) {}
}

/**
 * whether to support `__defineGetter__` and `__defineSetter__`
 */
export const propAccessor: boolean = propDescriptor || !!__defineSetter__

if (!propDescriptor)
	$defProp = __defineSetter__
		? function defineProperty(obj, prop, desc) {
				const { get, set } = desc
				if ('value' in desc || !(prop in obj)) obj[prop] = desc.value
				get && __defineGetter__.call(obj, prop, get)
				set && __defineSetter__.call(obj, prop, set)
				return obj
		  }
		: function defineProperty(obj, prop, desc) {
				if (desc.get || desc.set) throw new TypeError('property accessors are not supported.')
				if ('value' in desc || !(prop in obj)) obj[prop] = desc.value
				return obj
		  }

/**
 * define property
 */
export const defProp = $defProp

/**
 * define property by value
 */
export const defValue: <V>(
	obj: any,
	prop: string,
	value: V,
	enumerable?: boolean,
	configurable?: boolean,
	writable?: boolean
) => V = propDescriptor
	? function defValue(obj, prop, value, configurable, writable, enumerable) {
			$defProp(obj, prop, {
				value,
				enumerable: enumerable !== false,
				configurable: configurable !== false,
				writable: writable !== false
			})
			return value
	  }
	: function defValue(obj, prop, value) {
			obj[prop] = value
			return value
	  }
