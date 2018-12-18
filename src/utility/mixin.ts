/**
 * @module utility/mixin
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Dec 18 2018 16:41:03 GMT+0800 (China Standard Time)
 * @modified Tue Dec 18 2018 19:01:41 GMT+0800 (China Standard Time)
 */

import { hasOwnProp } from './prop'

export function mixin<B>(behaviour: B) {
	return function mixin<M extends B, TFunction extends Function>(
		Class: TFunction & { new (...args: Array<any>): M }
	) {
		const proto = Class.prototype
		for (var k in behaviour) if (hasOwnProp(behaviour, k)) proto[k] = behaviour[k]
		return Class
	}
}
