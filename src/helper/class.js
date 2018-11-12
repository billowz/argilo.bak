// @flow
/**
 * class builder
 * @module helper/class
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:45:23 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 16:40:07 GMT+0800 (China Standard Time)
 */

import { assert } from 'devlevel'
import { __inherit } from './inherit'
import { extend, extendBy } from './extend'
import { assign } from './assign'
import { applyScope } from './function'
import { getOwnProp } from './ownProp'
import { isFn } from './is'
import { makeMap } from './util'
import { CONSTRUCTOR, PROTOTYPE } from './constants'

const CLASS_NAME = 'name',
	EXTEND = 'extend',
	STATICS = 'statics'

const KEYS = makeMap([CLASS_NAME, CONSTRUCTOR, EXTEND, STATICS, PROTOTYPE])

/**
 * create class
 * @param {Object} overrides 				class descriptor
 * @param {string} overrides.name?			class name
 * @param {Function} overrides.constructor?	constructor of class
 * @param {Function} overrides.prototype?	prototype of class
 * @param {Object} overrides.statics?		static properties
 * @param {any} overrides....				properties on prototype
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

	assert(!constructor || isFn(constructor), 'Invalid Constructor')
	assert(!superCls || isFn(superCls), 'Invalid Super Class')

	if (superCls === Object) superCls = null

	const C = buildCls(constructor, overrides[CLASS_NAME], superCls)
	if (superCls) __inherit(C, superCls)
	extendBy(C, keyFilter, overrides)
	extend(C, overrides[PROTOTYPE])
	assign(C, overrides[STATICS])
	return C
}

/**
 * generate class function
 * @private
 * @param  {Function} cls?
 * @param  {string} name?
 * @param  {Function} superCls?
 * @returns {Function}
 */
function buildCls(cls?: Function, name?: string, superCls?: Function): Function {
	if (name)
		return new Function(
			'apply',
			'S',
			`return function ${name}(){
    ${cls || superCls ? `apply(S, this, arguments);` : ''}
}`
		)(applyScope, cls || superCls)

	return (
		cls ||
		(superCls
			? function() {
					applyScope(superCls, this, arguments)
			  }
			: function() {})
	)
}

function keyFilter(prop) {
	return !KEYS[prop]
}
