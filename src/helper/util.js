/**
 * @module helper/util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon May 21 2018 22:09:01 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 15:45:04 GMT+0800 (China Standard Time)
 */
import create from './create'
import { isFn, isArray, isStr } from './is'

export function array2obj(array, keyHandler, valueHandler = arrayElementHandler) {
	const dist = create(null)
	for (let i = 0, l = array.length, v; i < l; i++) {
		v = array[i]
		dist[keyHandler(v, i, array)] = valueHandler(v, i, array)
	}
	return dist
}

export function makeMap(props, split, val) {
	const arglen = arguments.length
	if (arglen < 3) {
		if (arglen === 2) {
			val = split
		} else {
			val = true
		}
		split = ','
	}

	if (isStr(props)) {
		if (!props) return create(null)
		props = props.split(split)
	}
	const valueHandler = isFn(val) ? val : () => val
	return array2obj(props, arrayElementHandler, valueHandler)
}

function arrayElementHandler(v) {
	return v
}

export function makeArray(array, split, map) {
	const arglen = arguments.length
	if (arglen < 3) {
		if (arglen === 2) map = split
		split = ','
	}

	if (isStr(array)) {
		if (!array) return []
		array = array.split(split)
	}
	if (map) for (var i = 0, l = array.length; i < l; i++) array[i] = map(array[i], i)
	return array
}

export function cached(cacheKey, cacheVal) {
	const cache = create(null)
	return function() {
		const key = applyNoScope(cacheKey, arguments)
		let val = cache[key]
		if (!val) cache[key] = val = applyNoScope(cacheVal, arguments)
		return val
	}
}
