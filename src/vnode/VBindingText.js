/**
 * @module vnode
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:32:13 GMT+0800 (China Standard Time)
 */
import { VIRT_BINDING_TEXT } from './VNode'
import VText from './VText'
import TransformExpression from './expression'
import { inherit } from '../helper'

export default inherit(
	function VBindingText(comp, expr) {
		VText.call(this, comp)
		this.expr = expr
	},
	VText,
	{
		[VIRT_BINDING_TEXT]: true,
		prepare(text) {
			return new TransformExpression(text)
		},
		mount() {
			const { expr, comp } = this
			this.text(expr.transformValue(comp, [this]))
			comp.observeExpr(expr, this.exprHandler, this)
		},
		unmount() {
			this.comp.unobserveExpr(this.expr, this.exprHandler, this)
		},
		exprHandler(path, value) {
			const { expr, comp } = this
			this.text(expr.simple ? expr.transform(value, comp, [this]) : expr.transformValue(comp, [this]))
		}
	}
)
