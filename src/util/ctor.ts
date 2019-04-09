/**
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 13:57:32 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 11:50:32 GMT+0800 (China Standard Time)
 */

import { T_FN, P_CTOR } from './consts'

export function getCtor(o: any) {
	let C = o[P_CTOR]
	return typeof C === T_FN ? C : Object
}
