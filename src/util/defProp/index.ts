/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Wed Apr 10 2019 11:47:32 GMT+0800 (China Standard Time)
 */

//#if _TARGET === 'es3'

import { defProp } from './polyfill'
export { propDescriptor, propAccessor, defProp } from './polyfill'

/*#else

import { defProp } from './polyfill'
export { propDescriptor, propAccessor, defProp } from './main'

//#endif */

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

export function defAccessor(
	obj: any,
	prop: string,
	get: () => any,
	set: (v: any) => void,
	enumerable?: boolean,
	configurable?: boolean
) {
	defProp(obj, prop, {
		get,
		set,
		enumerable: enumerable !== false,
		configurable: configurable !== false
	})
}
