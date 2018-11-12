/*
 *
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-25 17:47:25
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-31 18:36:56
 */
import { assert } from 'devlevel'
import { VElement } from '../vnode'
import HTMLMixin from './HTMLMixin'
import ElementMixin from './ElementMixin'
import ElementAttrMixin from './ElementAttrMixin'
import ElementClassMixin from './ElementClassMixin'
import ElementStyleMixin from './ElementStyleMixin'
import ElementValueMixin from './ElementValueMixin'
import ElementEventMixin from './ElementEventMixin'
import { inherit } from '../helper'

export default inherit(
	function Element(comp, option) {
		VElement.call(this, comp, option)
	},
	VElement,
	HTMLMixin(VElement),
	ElementMixin,
	ElementAttrMixin,
	ElementClassMixin,
	ElementStyleMixin,
	ElementValueMixin,
	ElementEventMixin
)
