/**
 * @module helper/filter
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:24:09 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 16:16:34 GMT+0800 (China Standard Time)
 */

import { map, mapArray, mapStr, mapObj, SKIP } from './map'
import { STOP } from './each'

export const filterArray = __mkFilter(mapArray),
	filterStr = __mkFilter(mapStr),
	filterObj = __mkFilter(mapObj),
	filter = __mkFilter(map)

export function __mkFilter(map) {
	return function(obj, callback, scope, own) {
		if (scope) callback = callback.bind(scope)
		return map(
			obj,
			(val, index, obj) => {
				const ret = callback(val, index, obj)
				if (ret === STOP || ret === SKIP) return ret
				return ret ? val : SKIP
			},
			undefined,
			own
		)
	}
}
