/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:32:23
 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-29 12:32:23
 */
import { __assign } from '../helper/assign'
import { proxy, $hasOwnProp } from './observer'

export function $assign(obj) {
	return __assign(obj, arguments, 1, __assignFilter)
}

export function $assignIf(obj) {
	return __assign(obj, arguments, 1, __assignIfFilter)
}

export function $assignBy(obj, filter) {
	return __assign(obj, arguments, 2, __assignUserFilter, filter)
}

function __assignUserFilter(prop, dist, source, cb) {
	return $hasOwnProp(source, prop) && cb(prop, dist, source)
}

function __assignIfFilter(prop, dist, source) {
	return $hasOwnProp(source, prop) && !$hasOwnProp(dist, prop)
}

function __assignFilter(prop, dist, source) {
	return $hasOwnProp(source, prop)
}
