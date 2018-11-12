/**
 * @module helper/find
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:31:16 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 16:16:21 GMT+0800 (China Standard Time)
 */

import { each, eachArray, eachStr, eachObj, reach, reachArray, reachStr, STOP } from './each'

export const findArray = __mkFind(eachArray),
	findStr = __mkFind(eachStr),
	findObj = __mkFind(eachObj),
	find = __mkFind(each),
	rfindArray = __mkFind(reachArray),
	rfindStr = __mkFind(reachStr),
	rfind = __mkFind(reach)

export function __mkFind(each) {
	return function(obj, callback, scope, own) {
		if (scope) callback = callback.bind(scope)
		return each(
			obj,
			(val, index, obj) => {
				if (callback(val, index, obj)) return STOP
			},
			undefined,
			own
		)
	}
}
