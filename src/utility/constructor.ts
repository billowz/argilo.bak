/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Wed Dec 19 2018 11:11:43 GMT+0800 (China Standard Time)
 */

import { TYPE_FN, CONSTRUCTOR } from './consts'

export function getConstructor(o) {
	let C = o[CONSTRUCTOR]
	return typeof C === TYPE_FN ? C : Object
}
