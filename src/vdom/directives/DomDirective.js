import { Directive } from '../../vnode'
import { isFn, inherit } from '../../helper'
import { EventExpression } from '../expression'

export default inherit(
	function DomDirective(node, expr, params) {
		Directive.call(this, node, params)
	},
	Directive,
	{
		$nodeKey: '$htmlElement',
		$nodeName: 'HTML Virtual Element'
	}
)
