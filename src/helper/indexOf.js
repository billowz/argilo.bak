/**
 * @module helper/idxOf
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:51:39 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 16:16:00 GMT+0800 (China Standard Time)
 */

import { each, eachArray, eachStr, eachObj, reach, reachArray, reachStr } from './each'

export const indexOfArray = __mkTypeIndexOf(eachArray),
	indexOfObj = __mkTypeIndexOf(eachObj),
	lastIndexOfArray = __mkTypeIndexOf(reachArray),
	indexOf = __mkIndexOf(indexOfArray, 'indexOf'),
	lastIndexOf = __mkIndexOf(lastIndexOfArray, 'lastIndexOf')

export function __mkTypeIndexOf(each) {
	return function(obj, val, own) {
		return each(
			obj,
			(v, index, obj) => {
				if (eq(v, val)) return STOP
			},
			undefined,
			own
		)
	}
}

export function __mkIndexOf(indexOfArray, strIndexOf) {
	return function(obj, val, own) {
		const arrayType = isArrayLike(obj)
		if (arrayType === String) {
			const i = obj[strIndexOf](val)
			if (i >= 0) return i
		} else {
			return (arrayType ? indexOfArray : indexOfObj)(obj, val, own)
		}
	}
}
