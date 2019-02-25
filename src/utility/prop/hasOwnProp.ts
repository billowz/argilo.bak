/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:57 GMT+0800 (China Standard Time)
 * @modified Sat Dec 29 2018 18:35:40 GMT+0800 (China Standard Time)
 */

import { PROTOTYPE, HAS_OWN_PROP } from '../consts'

const __hasOwn = Object[PROTOTYPE][HAS_OWN_PROP]

/**
 * has own property
 */
export function hasOwnProp(obj: any, prop: string): boolean {
	return __hasOwn.call(obj, prop)
}
