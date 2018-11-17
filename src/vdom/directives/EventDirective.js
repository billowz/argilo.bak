import { assert } from 'devlevel'
import DomDirective from './DomDirective'
import { isFn, inherit } from '../../helper'
import { EventExpression } from '../expression'
import { STOP_PROPAGATION } from '../util/util'

export default inherit(
	function EventDirective(node, expr, params) {
		DomDirective.call(this, node, params)
		this.expr = params.expr
	},
	DomDirective,
	{
		prepare(params) {
			params.expr = new EventExpression(params.value)
		},
		handler(e) {
			const expr = this.expr,
				comp = this.comp,
				node = this.node,
				args = [node, e]

			e[STOP_PROPAGATION]()

			if (expr.filter(comp, args)) {
				const ret = expr.value(comp, args)
				if (isFn(ret)) {
					ret.call(comp, e, node)
				} else {
					assert(!expr.sample, `Invalid Event Handler: ${this.params.value}`)
				}
			}
		},
		bind() {
			const node = this.node,
				handler = this.handler,
				type = this.eventType
			if (type.push) {
				for (var i = 0; i < type.length; i++) node.on(type[i], handler, this)
			} else {
				node.on(type, handler, this)
			}
		},
		unbind() {
			const node = this.node,
				handler = this.handler,
				type = this.eventType
			if (type.push) {
				for (var i = 0; i < type.length; i++) node.un(type[i], handler, this)
			} else {
				node.un(type, handler, this)
			}
		}
	}
)
