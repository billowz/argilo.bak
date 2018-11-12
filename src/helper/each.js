/**
 * @module helper/each
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 17:10:41 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 16:18:17 GMT+0800 (China Standard Time)
 */

import { isArrayLike, isStr } from './is'
import { hasOwnProp } from './ownProp'

export const STOP = new String('STOP')

export const eachArray = __mkEachArrayLike(arrayValueHandler),
	eachStr = __mkEachArrayLike(strValueHandler),
	reachArray = __mkREachArrayLike(arrayValueHandler),
	reachStr = __mkREachArrayLike(strValueHandler),
	each = __mkEach(eachStr, eachArray, eachObj),
	reach = __mkEach(reachStr, reachArray, eachObj)

export function eachObj(obj, callback, scope, own) {
	if (scope) callback = callback.bind(scope)
	let key
	if (own === false) {
		for (key in obj) if (callback(obj[key], key, obj) === STOP) return key
	} else {
		for (key in obj) if (hasOwnProp(obj, key) && callback(obj[key], key, obj) === STOP) return key
	}
}

export function __mkEach(eachStr, eachArray, eachObj) {
	return function(obj, callback, scope, own) {
		const arrayType = isArrayLike(obj)
		return (arrayType ? (arrayType === String ? eachStr : eachArray) : eachObj)(obj, callback, scope, own)
	}
}

export function __mkEachArrayLike(valueHandler) {
	return function(array, callback, scope) {
		if (scope) callback = callback.bind(scope)
		for (let i = 0, l = array.length; i < l; i++) if (callback(valueHandler(array, i), i, array) === STOP) return i
	}
}

export function __mkREachArrayLike(valueHandler) {
	return function(array, callback, scope) {
		if (scope) callback = callback.bind(scope)
		let i = array.length
		while (i--) {
			if (callback(valueHandler(array, i), i, array) === STOP) return i
		}
	}
}

function arrayValueHandler(array, i) {
	return array[i]
}

function strValueHandler(str, i) {
	return str.charAt(i)
}

export function eachChain(array, v, callback, scope) {
	if (scope) callback = callback.bind(scope)
	for (let i = 0, l = array.length; i < l; i++) {
		v = callback(array[i], i, v, array)
		if (v === STOP) return STOP
	}
	return v
}
