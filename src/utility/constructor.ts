/**
 * @module utility
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Sat Feb 16 2019 10:53:30 GMT+0800 (China Standard Time)
 */

import { TYPE_FN, CONSTRUCTOR } from './consts'

export function getConstructor(o: any) {
	let C = o[CONSTRUCTOR]
	return typeof C === TYPE_FN ? C : Object
}
