/*
 * Dom Event Expression
 *
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-20 16:46:41
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-04 17:04:17
 */
import { assert } from 'devlevel'
import { Expression } from '../../Expression'
import { VNodeKeyword, identityHandler } from '../../vnode/expression/identityHandler'
import { parsePath } from '../../common'
import { create, inherit, isFn } from '../../helper'

export const eventFilters = create(null)

export const EventKeyword = '$event'

function eventIdentityHandler(prefix, identity, opt) {
	identity = parsePath(identity)
	if (identity[0] !== EventKeyword) return doIdentityHandler(prefix, identity, opt)
}

const paramNames = [VNodeKeyword, EventKeyword]
export function EventExpression(code, eventFilters, keywords) {
	Expression.call(this, code, paramNames, eventIdentityHandler, this.parseFilter.bind(this), keywords)
	this.eventFilters = eventFilters
}

function doFilter(filter, args) {
	return filter(args[1], args)
}
inherit(EventExpression, Expression, {
	transformValue(scope, args) {
		return this.transform(this.execute(scope, args), scope, args)
	},
	filter(scope, args) {
		return this.eachFilter(doFilter, scope, args) !== false
	},
	parseFilter(name) {
		const localFilters = this.eventFilters
		const filter = (localFilters && localFilters[name]) || eventFilters[name]

		assert(filter, `EventFilter[${name}] is undefined`)

		assert(isFn(filter), `Invalid EventFilter[${name}] on ${localFilters && localFilters[name] ? 'Local' : 'Global'} EventFilters`)
		return filter
	},
})
