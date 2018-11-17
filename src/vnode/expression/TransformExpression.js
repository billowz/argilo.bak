/**
 * VNode Transform of Expression
 * @module vnode/expression
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:31:46 GMT+0800 (China Standard Time)
 */
import { assert } from 'devlevel'
import { Expression } from '../../Expression'
import { VNodeKeyword, identityHandler } from './identityHandler'
import { parsePath } from '../../common'
import { create, inherit, isFn } from '../../helper'

export const transforms = create(null)

function transformIdentityHandler(prefix, identity, opt) {
	return identityHandler(prefix, parsePath(identity), opt)
}

const paramNames = [VNodeKeyword]
export default function TransformExpression(code, transforms, keywords) {
	Expression.call(this, code, paramNames, transformIdentityHandler, this.parseFilter.bind(this), keywords)
	this.transforms = transforms
}

inherit(TransformExpression, Expression, {
	value(scope, args) {
		return this.execute(scope, args)
	},
	transformValue(scope, args) {
		return this.transform(this.execute(scope, args), scope, args)
	},
	transform(value, scope, args) {
		this.eachFilter(
			(filter, args) => {
				value = isFn(filter) ? filter(value, args) : filter.transform.call(filter, value, args)
			},
			scope,
			args
		)
		return value
	},
	checkRestore() {
		assert.by(() => {
			this.reachFilter(filter => {
				assert.fn(filter.restore, `Transform[${name}] not support restore`)
			})
		})
	},
	restore(value, scope, args) {
		this.reachFilter(
			(filter, args, name) => {
				assert.fn(filter.restore, `Transform[${name}] not support restore`)
				value = filter.restore.call(filter, value, args)
			},
			scope,
			args
		)
		return value
	},
	parseFilter(name) {
		const localTransforms = this.transforms
		const transform = (localTransforms && localTransforms[name]) || transforms[name]

		assert(transform, `Transform[${name}] is undefined`)

		assert(
			isFn(transform) || isFn(transform.transform),
			`Invalid Transform[${name}].transform handler on ${
				localTransforms && localTransforms[name] ? 'Local' : 'Global'
			} Transforms`
		)

		assert(
			!transform.restore || isFn(transform.transform),
			`Invalid Transform[${name}].restore handler on ${
				localTransforms && localTransforms[name] ? 'Local' : 'Global'
			} Transforms`
		)

		return transform
	}
})
