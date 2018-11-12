import { assert } from 'devlevel'
import DomDirective from './DomDirective'
import { isFn, inherit, isNil } from '../../helper'
import { TransformExpression } from '../../vnode'

export default inherit(
	function ExpressionDirective(node, params) {
		DomDirective.call(this, node, params)
		this.expr = params.expr
	},
	DomDirective,
	{
		prepare(params) {
			params.expr = new TransformExpression(params.value)
		},
		realValue() {
			return this.expr.value(this.comp, [this.node])
		},
		value() {
			return this.expr.transformValue(this.comp, [this.node])
		},
		transform(value) {
			return this.expr.transform(value, this.comp, [this.node])
		},
		blankValue(value) {
			if (!arguments.length) value = this.value()
			return isNil(value) ? '' : value
		},
		observeHandler(path, value) {
			this.update(this.expr.simple ? this.transform(value) : this.value())
		},
		bind() {
			this.observeExpr(this.expr, this.observeHandler, this)
			this.update(this.value())
		},
		unbind() {
			this.unobserveExpr(this.expr, this.observeHandler, this)
		},
		update(value) {
			throw new Error(`abstract method`)
		},
	}
)
