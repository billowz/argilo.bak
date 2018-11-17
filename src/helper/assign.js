// @flow
/**
 * Object.assign shim
 * @module helper/assign
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:22:13 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:33:18 GMT+0800 (China Standard Time)
 */
import create from './create'
import { hasOwnProp } from './prop'

/**
 * assign filter
 * @callback AssignFilter
 * @param  {string} prop		property name
 * @param  {Object} target		target object
 * @param  {Object} override	override object
 * @returns {boolean} is assign
 */
export type AssignFilter = (prop: string, target: Object, override: Object) => boolean

/**
 * assign properties
 * @param  {Object|void} 		target						target object
 * @param  {Array<?Object>} 	overrides						override objects
 * @param  {AssignFilter} 		filter							filter
 * @param  {number} 			[startOffset=0]					start offset in overrides
 * @param  {number} 			[endOffset=overrides.length-1]	end offset in overrides
 * @returns {any} target object
 */
export function doAssign(
	target: ?Object | ?Function,
	overrides: Array<?Object>,
	filter: AssignFilter,
	startOffset?: number,
	endOffset?: number
) {
	if (!target) target = {}
	let i = startOffset || 0,
		l = endOffset || overrides.length - 1,
		override,
		prop
	for (; i < l; i++) {
		if ((override = overrides[i]))
			for (prop in override) if (filter(prop, target, override)) target[prop] = override[prop]
	}
	return target
}

/**
 * assign properties
 * > Object.assign shim
 * @param  {Object} 			[target]	target object
 * @param  {Array<?Object>} 	...args 	override objects
 * @returns {Object} target object
 */
export function assign(target: ?Object | ?Function, ...objs: Array<?Object>): Object {
	return doAssign(target, arguments, defaultAssignFilter, 1)
}

/**
 * assign un-exist properties
 * @param  {Object} 			[target]	target object
 * @param  {Array<?Object>} 	...args 	override objects
 * @returns {Object} target object
 */
export function assignIf(target: ?Object | ?Function, ...objs: Array<?Object>): Object {
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
export function defaultAssignFilter(prop: string, target: Object, override: Object): boolean {
	return hasOwnProp(override, prop)
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
export function assignIfFilter(prop: string, target: Object, override: Object): boolean {
	return hasOwnProp(override, prop) && !(prop in target)
}
