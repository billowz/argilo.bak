/**
 * property utilities
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Thu Jan 31 2019 10:15:09 GMT+0800 (China Standard Time)
 */

//#if _TARGET === 'es3'

import { hasOwnProp } from './polyfill'
export { hasOwnProp, propDescriptor, propAccessor, defProp, defPropValue } from './polyfill'

/*#else

import { hasOwnProp } from './hasOwnProp'
export { hasOwnProp } from './hasOwnProp'
export { propDescriptor, propAccessor, defProp, defPropValue } from './main'

//#endif */

/**
 * get owner property value
 * @param prop 			property name
 * @param defaultVal 	default value
 */
export function getOwnProp(obj: any, prop: string, defaultVal?: any): any {
	return hasOwnProp(obj, prop) ? obj[prop] : defaultVal
}
