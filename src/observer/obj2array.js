/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:33:14
 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-29 12:33:14
 */
import { proxy, $hasOwnProp, isDefaultProp } from './observer'
import { STOP, SKIP } from '../helper'
import { __mkKV } from '../helper/obj2array'

export function $obj2array(obj, valueHandler, scope, own) {
	const array = []
	let key,
		ret,
		i = 0

	if (scope) valueHandler = valueHandler.bind(scope)
	if (own === false) {
		for (key in obj) {
			if (!isDefaultProp(key)) {
				ret = valueHandler(obj, key)
				if (ret === STOP) break
				if (ret !== SKIP) array[i++] = ret
			}
		}
	} else {
		for (key in obj) {
			if ($hasOwnProp(obj, key)) {
				ret = valueHandler(obj, key)
				if (ret === STOP) break
				if (ret !== SKIP) array[i++] = ret
			}
		}
	}
	return array
}

export const $keys = __mkKV($obj2array, keyHandler),
	$values = __mkKV($obj2array, valueHandler)

function keyHandler(obj, key) {
	return isDefaultProp(key) ? isDefaultProp : key
}

function valueHandler(obj, key) {
	return proxy(obj[key])
}
