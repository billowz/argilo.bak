/**
 * @module helper/extend
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 16:07:37 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 16:16:49 GMT+0800 (China Standard Time)
 */

import { assert } from 'devlevel'
import { __assign } from './assign'
import { CONSTRUCTOR, PROTOTYPE } from './constants'

export function __extend(cls, mixins, offset, filter, data) {
	assert.fn(cls, 'Invalid Class')

	__assign(cls[PROTOTYPE], mixins, offset, filter, data)
	return cls
}

export function extend(cls) {
	return __extend(cls, arguments, 1, __extendFilter)
}

export function __extendFilter(prop, proto, mixin) {
	return prop !== CONSTRUCTOR
}

export function extendIf(cls) {
	return __extend(cls, arguments, 1, __extendIfFilter)
}

export function __extendIfFilter(prop, proto, mixin) {
	return prop !== CONSTRUCTOR && !(prop in proto)
}

export function extendBy(cls, filter) {
	return __extend(cls, arguments, 2, __extendUserFilter, filter)
}

export function __extendUserFilter(prop, proto, mixin, cb) {
	return prop !== CONSTRUCTOR && cb(prop, proto, mixin)
}
