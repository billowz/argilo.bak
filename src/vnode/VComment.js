/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:36:40
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-15 19:13:45
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
		[VIRT_COMMENT]: true,
	}
)
