/**
 * @module vnode
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:32:36 GMT+0800 (China Standard Time)
 */
import VNode, { VIRT_TEXT } from './VNode'
import { inherit, isNil, strval } from '../helper'

export default inherit(
	function VText(comp, text) {
		VNode.call(this, comp)
		this.data = text
	},
	VNode,
	{
		[VIRT_TEXT]: true,
		text(text) {
			const { data } = this
			if (arguments.length === 0) return data
			text = strval(text)
			if (text !== data) {
				this.update(text)
				this.data = text
			}
			return this
		}
	}
)
