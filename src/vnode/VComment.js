/**
 * @module vnode
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:32:19 GMT+0800 (China Standard Time)
 */
import VNode, { VIRT_COMMENT } from './VNode'
import { inherit } from '../helper'

export default inherit(
	function VComment(comp, comment) {
		VNode.call(this, comp)
		this.comment = comment
	},
	VNode,
	{
		[VIRT_COMMENT]: true
	}
)
