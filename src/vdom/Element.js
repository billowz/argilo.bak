/**
 * @module vdom
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:27:52 GMT+0800 (China Standard Time)
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
