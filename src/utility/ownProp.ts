/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Wed Mar 13 2019 20:10:29 GMT+0800 (China Standard Time)
 */

import { PROTOTYPE, HAS_OWN_PROP } from './consts'
import { defaultKeyMap } from './dkeys'
import { propDescriptor } from './defProp'

const __hasOwn = Object[PROTOTYPE][HAS_OWN_PROP]

/**
 * has own property
 */
export const hasOwnProp: (obj: any, prop: string) => boolean = propDescriptor
	? (obj: any, prop: string): boolean => {
			return __hasOwn.call(obj, prop)
	  }
	: (obj: any, prop: string): boolean => {
			return !defaultKeyMap[prop] && __hasOwn.call(obj, prop)
	  }

/**
 * get owner property value
 * @param prop 			property name
 * @param defaultVal 	default value
 */
export function getOwnProp(obj: any, prop: string, defaultVal?: any): any {
	return hasOwnProp(obj, prop) ? obj[prop] : defaultVal
}
