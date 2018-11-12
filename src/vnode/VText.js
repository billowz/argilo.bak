/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:36:05
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-15 19:14:12
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
		},
	}
)
