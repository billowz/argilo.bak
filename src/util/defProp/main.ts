/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 18:57:32 GMT+0800 (China Standard Time)
 */

export const propDescriptor = true
export const propAccessor = true
export const defProp = Object.defineProperty
export function defValue<V>(
	obj: any,
	prop: string,
	value: V,
	enumerable?: boolean,
	configurable?: boolean,
	writable?: boolean
): V {
	defProp(obj, prop, {
		value,
		enumerable: enumerable !== false,
		configurable: configurable !== false,
		writable: writable !== false
	})
	return value
}
