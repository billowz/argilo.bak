/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:36:23
 * @Last Modified by: Tao Zeng (tao.zeng.zt@qq.com)
 * @Last Modified time: 2018-11-07 16:07:37
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
		},
	}
)
