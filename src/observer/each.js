/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:32:20
 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-29 12:32:20
 */
import { proxy, $hasOwnProp, isDefaultProp } from './observer'
import { eachObj, eachStr, reachStr, __mkEachArrayLike, __mkREachArrayLike, __mkEach, STOP } from '../helper/each'

export const $eachArray = __mkEachArrayLike(arrayValueHandler),
	$reachArray = __mkREachArrayLike(arrayValueHandler),
	$each = __mkEach(eachStr, $eachArray, $eachObj),
	$reach = __mkEach(reachStr, $reachArray, $eachObj)

export function $eachObj(obj, callback, scope, own) {
	if (scope) callback = callback.bind(scope)
	let key
	if (own === false) {
		for (key in obj) if (!isDefaultProp(key) && callback(proxy(obj[key]), key, obj) === STOP) return key
	} else {
		for (key in obj) if ($hasOwnProp(obj, key) && callback(proxy(obj[key]), key, obj) === STOP) return key
	}
}

function arrayValueHandler(array, i) {
	const obj = array[i]
	return obj ? proxy(obj) : obj
}
