/**
 * @module helper/obj2arr
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Jul 26 2018 10:47:47 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 16:15:07 GMT+0800 (China Standard Time)
 */

import { STOP } from './each'
import { SKIP } from './map'
import { hasOwnProp } from './ownProp'

export function obj2array(obj, valueHandler, scope, own) {
	const array = []
	let key,
		ret,
		i = 0

	if (scope) valueHandler = valueHandler.bind(scope)
	if (own === false) {
		for (key in obj) {
			ret = valueHandler(obj, key)
			if (ret === STOP) break
			if (ret !== SKIP) array[i++] = ret
		}
	} else {
		for (key in obj) {
			if (hasOwnProp(obj, key)) {
				ret = valueHandler(obj, key, i)
				if (ret === STOP) break
				if (ret !== SKIP) array[i++] = ret
			}
		}
	}
	return array
}

export const keys = __mkKV(obj2array, keyHandler),
	values = __mkKV(obj2array, valueHandler)

export function __mkKV(obj2array, handler) {
	return function(obj, own, filter, scope) {
		if (filter) {
			if (scope) filter = filter.bind(scope)
			return obj2array(
				obj,
				(obj, key) => {
					const ret = filter(obj, key)
					if (!ret) return SKIP
					if (ret === STOP || ret === SKIP) return ret
					return handler(obj, key)
				},
				undefined,
				own
			)
		}
		return obj2array(obj, handler, undefined, own)
	}
}

function keyHandler(obj, key) {
	return key
}

function valueHandler(obj, key) {
	return obj[key]
}
