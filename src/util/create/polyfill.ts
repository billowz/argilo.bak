/**
 * Object.create polyfill
 * @module util
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 14:11:37 GMT+0800 (China Standard Time)
 */

import { P_PROTOTYPE } from '../consts'
import { defProp } from '../defProp'
import { hasOwnProp } from '../ownProp'
import { __setProto } from '../proto'

function __() {}

/**
 * create shim
 */
function doCreate(o: object | null, props?: PropertyDescriptorMap & ThisType<any>): any {
	__[P_PROTOTYPE] = o
	const obj = new __()
	__[P_PROTOTYPE] = null
	if (props) {
		for (var k in props) {
			if (hasOwnProp(props, k)) {
				defProp(obj, k, props[k])
			}
		}
	}
	return obj
}

/**
 * create object
 */
export const create =
	Object.create ||
	(Object.create = Object.getPrototypeOf
		? doCreate
		: function create(o: object | null, props?: PropertyDescriptorMap & ThisType<any>): any {
				const obj = doCreate(o, props)
				__setProto(obj, o)
				return obj
		  })
