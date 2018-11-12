// @flow
/**
 * Object.create shim
 * @module helper/create
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Sat Nov 10 2018 17:13:22 GMT+0800 (China Standard Time)
 */

import { setPrototypeOf } from './prototypeOf'
import { CONSTRUCTOR, PROTOTYPE } from './constants'

function FN() {}

/**
 * create shim
 * @private
 * @param  {T} parent
 * @param  {any} props?
 * @returns T
 */
function doCreate<T>(parent: T, props?: any): T {
	FN[PROTOTYPE] = parent
	const obj = new FN()
	FN[PROTOTYPE] = undefined
	if (props) {
		var k, v
		for (k in props) {
			v = props[k]
			if (v && v[CONSTRUCTOR] === Object) obj[k] = v.value
		}
	}
	return obj
}

/**
 * create object
 * @function create
 * @static
 * @param {T} obj
 * @param {any} props?
 * @returns {T}
 */
export default Object.create ||
	(Object.getPrototypeOf
		? doCreate
		: function create<T>(parent: T, props?: any): T {
				// update prototype
				const obj = doCreate(parent, props)
				setPrototypeOf(obj, parent)
				return obj
		  })
