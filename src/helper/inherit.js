/**
 * @module helper/inherit
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:48:40 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 16:15:46 GMT+0800 (China Standard Time)
 */

import { assert } from 'devlevel'
import create from './create'
import { setPrototypeOf, prototypeOf } from './prototypeOf'
import { __extend, __extendFilter } from './extend'
import { isFn } from './is'
import { CONSTRUCTOR, PROTOTYPE } from './constants'

export function __inherit(cls, superCls) {
	const proto = create(superCls[PROTOTYPE])
	proto[CONSTRUCTOR] = cls
	cls[PROTOTYPE] = proto
	setPrototypeOf(cls, superCls)
}

export function inherit(cls, superCls) {
	assert.fn(cls, 'Invalid Class')

	let i = 2,
		l = arguments.length

	if (isFn(superCls)) __inherit(cls, superCls)
	else i = 1
	__extend(cls, arguments, i, __extendFilter)
	return cls
}

const fnProto = Function[PROTOTYPE]
const objProto = Object[PROTOTYPE]

export function superCls(cls) {
	cls = prototypeOf(cls)
	switch (cls) {
		case Object:
		case objProto:
		case fnProto:
			return undefined
	}
	return cls
}

export function subclassOf(cls, target) {
	if (target === Object) return true

	let parent = cls
	while ((parent = superCls(parent))) if (parent === target) return true
	return false
}
