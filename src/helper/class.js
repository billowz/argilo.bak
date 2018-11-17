// @flow
/**
 * class builder
 * @module helper/class
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:45:23 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:33:38 GMT+0800 (China Standard Time)
 */

import { __inherit } from './inherit'
import { extend, doExtend } from './extend'
import { assign } from './assign'
import { applyScope, createFn } from './fn'
import { getOwnProp } from './prop'
import { isFn } from './is'
import { makeMap } from './collection'
import { CONSTRUCTOR, PROTOTYPE } from './consts'

const CLASS_NAME = 'name',
	EXTEND = 'extend',
	STATICS = 'statics'

const KEYS = makeMap([CLASS_NAME, CONSTRUCTOR, EXTEND, STATICS, PROTOTYPE])

/**
 * create class
 * @param {Object} 			overrides 				class descriptor
 * @param {string} 			[overrides.name]		class name
 * @param {Function} 		[overrides.extend]		super class
 * @param {Function} 		[overrides.constructor]	constructor of class
 * @param {Object} 			[overrides.prototype]	prototype of class
 * @param {Object} 			[overrides.statics]		static properties
 * @param {Array<Object>} 	[overrides....]			properties on prototype
 * @returns {Function}
 */
export default function createClass(overrides: {
	name?: string,
	extend?: Function,
	constructor?: Function,
	prototype?: Object,
	statics?: Object
}): Function {
	const constructor = getOwnProp(overrides, CONSTRUCTOR)
	let superCls = overrides[EXTEND]
	if (superCls === Object) superCls = null

	const C = buildCls(constructor, overrides[CLASS_NAME], superCls)
	if (superCls) __inherit(C, superCls)

	doExtend(C, arguments, propertiesFilter, 1)

	extend(C, overrides[PROTOTYPE])

	assign(C, overrides[STATICS])
	return C
}

/**
 * generate class function
 * @private
 * @param  {Function} 	[cls]
 * @param  {string} 	[name]
 * @param  {Function} 	[superCls]
 * @returns {Function}
 */
function buildCls(cls: ?Function, name: ?string, superCls: ?Function): Function {
	if (name)
		return createFn(
			`return function ${name}(){
    ${cls || superCls ? `apply(S, this, arguments);` : ''}
}`,
			['apply', 'S']
		)(applyScope, cls || superCls)

	return (
		cls ||
		(superCls
			? function() {
					applyScope((superCls: any), this, arguments)
			  }
			: function() {})
	)
}

function propertiesFilter(prop: string): boolean {
	return !KEYS[prop]
}
