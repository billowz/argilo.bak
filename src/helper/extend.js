// @flow
/**
 * prototype extend
 * @module helper/extend
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 16:07:37 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 12:44:00 GMT+0800 (China Standard Time)
 */
import { doAssign } from './assign'
import { hasOwnProp } from './prop'
import { CONSTRUCTOR, PROTOTYPE } from './consts'

import type { AssignFilter } from './assign'

/**
 * extend filter
 * @callback ExtendFilter
 * @param  {string} prop		property name
 * @param  {Object} proto		prototype
 * @param  {Object} mixin		mixin object
 * @returns {boolean} is assign
 */
export type ExtendFilter = (prop: string, proto: Object, mixin: Object) => boolean

/**
 * extend class properties
 * @param  {Function} 			cls							constructor
 * @param  {Array<?Object>} 	mixins						mixin objects
 * @param  {ExtendFilter} 		filter						filter
 * @param  {number} 			[startOffset=0]				start offset in mixins
 * @param  {number} 			[endOffset=mixins.length-1]	end offset in mixins
 * @returns {Function} constructor
 */
export function doExtend(
	cls: Function,
	mixins: Array<?Object>,
	filter: AssignFilter,
	startOffset?: number,
	endOffset?: number
): Function {
	doAssign(cls[PROTOTYPE], mixins, filter, startOffset, endOffset)
	return cls
}

/**
 * extend class properties
 * @param  {Function} 			cls			constructor
 * @param  {Array<?Object>} 	...args 	extend objects
 * @returns {Function} constructor
 */
export function extend(cls: Function, ...objs: Array<?Object>): Function {
	return doExtend(cls, arguments, defaultExtendFilter, 1)
}

/**
 * extend un-exist class properties
 * @param  {Function} 			cls			constructor
 * @param  {Array<?Object>} 	...args 	extend objects
 * @returns {Function} constructor
 */
export function extendIf(cls: Function, ...objs: Array<?Object>): Function {
	return doExtend(cls, arguments, extendIfFilter, 1)
}

/**
 * default extend filter
 * - property is not "constructor"
 * @see {ExtendFilter}
 * @param  {string} prop
 * @param  {Object} proto
 * @param  {Object} mixin
 * @returns {boolean}
 */
export function defaultExtendFilter(prop: string, proto: Object, mixin: Object): boolean {
	return prop !== CONSTRUCTOR
}

/**
 * extend if filter
 * - property is not "constructor"
 * - property is not in property
 * @see {ExtendFilter}
 * @param  {string} prop
 * @param  {Object} proto
 * @param  {Object} mixin
 * @returns {boolean}
 */
export function extendIfFilter(prop: string, proto: Object, mixin: Object): boolean {
	return prop !== CONSTRUCTOR && !(prop in proto)
}
