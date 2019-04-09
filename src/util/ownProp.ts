/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 12:42:51 GMT+0800 (China Standard Time)
 */

import { P_PROTOTYPE, P_OWNPROP } from './consts'

const __hasOwn = Object[P_PROTOTYPE][P_OWNPROP]

/**
 * has own property
 */
export const hasOwnProp: (obj: any, prop: string) => boolean = (obj: any, prop: string): boolean => {
	return __hasOwn.call(obj, prop)
}

/**
 * get owner property value
 * @param prop 			property name
 * @param defaultVal 	default value
 */
export function getOwnProp(obj: any, prop: string, defaultVal?: any): any {
	return hasOwnProp(obj, prop) ? obj[prop] : defaultVal
}
