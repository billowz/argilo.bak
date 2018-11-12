/**
 * @module helper/map
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:12:06 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 16:16:54 GMT+0800 (China Standard Time)
 */

import create from './create'
import { each, eachArray, eachStr, eachObj, STOP, __mkEach } from './each'

export const SKIP = new String('SKIP')

export const mapArray = __mkMapArrayLike(eachArray),
	mapStr = __mkMapArrayLike(eachStr),
	mapObj = __mkMapObj(eachObj),
	map = __mkEach(mapStr, mapArray, mapObj)

export function __mkMapArrayLike(each) {
	return function(array, callback, scope) {
		const l = array.length,
			copy = new Array(l)
		let j = 0

		if (!callback) callback = defaultMapCallback
		else if (scope) callback = callback.bind(scope)

		each(array, (val, i, array) => {
			const ret = callback(val, i, array)
			if (ret === STOP || ret === SKIP) return ret
			copy[j++] = ret
		})
		if (j !== l) copy.length = j
		return copy
	}
}

export function __mkMapObj(each) {
	return function(obj, callback, scope, own) {
		const copy = create(null)

		if (!callback) callback = defaultMapCallback
		else if (scope) callback = callback.bind(scope)

		each(
			obj,
			(val, key, obj) => {
				const ret = callback(val, key, obj)
				if (ret === STOP || ret === SKIP) return ret
				copy[key] = ret
			},
			undefined,
			own
		)
		return copy
	}
}

function defaultMapCallback(v) {
	return v
}
