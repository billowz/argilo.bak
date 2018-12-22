/**
 * @module utility/mixin
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 18 2018 16:41:03 GMT+0800 (China Standard Time)
 * @modified Fri Dec 21 2018 10:24:24 GMT+0800 (China Standard Time)
 */

import { hasOwnProp } from './prop'

export function mixin<B>(behaviour: B) {
	return function mixin<M extends B, T extends { new (...args: Array<any>): M }>(Class: T) {
		const proto = Class.prototype
		for (var k in behaviour) if (hasOwnProp(behaviour, k)) proto[k] = behaviour[k]
		return Class
	}
}
