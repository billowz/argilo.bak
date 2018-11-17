// @flow
/**
 * @module helper/inherit
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:48:40 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 11:48:11 GMT+0800 (China Standard Time)
 */

import create from './create'
import { setPrototypeOf, prototypeOf } from './proto'
import { doExtend, defaultExtendFilter } from './extend'
import { isFn } from './is'
import { CONSTRUCTOR, PROTOTYPE } from './consts'

/**
 * class inherit
 * @param  {Function} cls		constructor
 * @param  {Function} superCls	constructor of super class
 */
export function __inherit(cls: Function, superCls: Function) {
	const proto = create(superCls[PROTOTYPE])
	proto[CONSTRUCTOR] = cls
	cls[PROTOTYPE] = proto
	setPrototypeOf(cls, superCls)
}

/**
 * class inherit
 * @param  {Function} 		cls			constructor
 * @param  {Function} 		[superCls]	constructor of super class
 * @param  {Array<Object>}	...args		mixins (extend objects)
 * @returns {Function} constructor
 */
export function inherit(cls: Function, superCls?: Function): Function {
	let i = 1,
		l = arguments.length

	if (isFn(superCls)) {
		__inherit(cls, (superCls: any))
		i = 2
	}
	return doExtend(cls, arguments, defaultExtendFilter, i)
}

const fnProto = Function[PROTOTYPE],
	objProto = Object[PROTOTYPE]

/**
 * get supper class
 * @param  {Function} cls	constructor
 * @returns {Function|null} super class
 */
export function superCls(cls: Function): Function | null {
	const c = prototypeOf(cls)
	switch (c) {
		case Object:
		case objProto:
		case fnProto:
			return null
	}
	return c
}
/**
 * is sub class
 * @param  {Function} 			cls		constructor
 * @param  {Object|Function} 	target	check Type
 * @returns {boolean}
 */
export function subclassOf(cls: Function, target: Object | Function): boolean {
	if (target === Object) return true

	let parent = cls
	while ((parent = superCls(parent))) if (parent === target) return true
	return false
}
