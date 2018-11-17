// @flow
/**
 *
 * @module observer/assign
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Thu Jul 26 2018 10:05:53 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 19:14:40 GMT+0800 (China Standard Time)
 */

import { proxy, $hasOwnProp } from './observer'
import { doAssign } from '../helper/assign'

/**
 * assign properties
 * > Object.assign shim
 * @see {assign}
 * @param  {Object} 			[target]	target object
 * @param  {Array<?Object>} 	...args 	override objects
 * @returns {Object} target object
 */
export function $assign(target: ?Object | ?Function, ...objs: Array<?Object>): Object {
	return doAssign(target, arguments, defaultAssignFilter, 1)
}

/**
 * assign un-exist properties
 * @see {assignIf}
 * @param  {Object} 			[target]	target object
 * @param  {Array<?Object>} 	...args 	override objects
 * @returns {Object} target object
 */
export function $assignIf(target: ?Object | ?Function, ...objs: Array<?Object>): Object {
	return doAssign(target, arguments, assignIfFilter, 1)
}

/**
 * default assign filter
 * - property is owner in override
 * @see {AssignFilter}
 * @param  {string} prop
 * @param  {Object} target
 * @param  {Object} override
 * @returns {boolean}
 */
export function $defaultAssignFilter(prop: string, target: Object, override: Object): boolean {
	return $hasOwnProp(override, prop)
}

/**
 * assign if filter
 * - property is owner in override
 * - property not in target object
 * @see {AssignFilter}
 * @param  {string} prop
 * @param  {Object} target
 * @param  {Object} override
 * @returns {boolean}
 */
export function $assignIfFilter(prop: string, target: Object, override: Object): boolean {
	return $hasOwnProp(override, prop) && !(prop in target)
}
