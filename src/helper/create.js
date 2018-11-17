// @flow
/**
 * Object.create shim
 * @module helper/create
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Wed Jul 25 2018 15:24:47 GMT+0800 (China Standard Time)
 * @modified Fri Nov 16 2018 12:12:06 GMT+0800 (China Standard Time)
 */

import { setPrototypeOf } from './proto'
import { CONSTRUCTOR, PROTOTYPE } from './consts'

function FN() {}

/**
 * create shim
 * @private
 * @param  {T} parent
 * @param  {any} props?
 * @returns T
 */
function doCreate(parent: Object, props?: any): Object {
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
		: function create(parent: Object, props?: any): Object {
				// update prototype
				const obj = doCreate(parent, props)
				setPrototypeOf(obj, parent)
				return obj
		  })
