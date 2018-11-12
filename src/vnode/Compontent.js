/*
 * <CompontentTag>
 *      <div ref=""
 * </CompontentTag>
 *
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:37:24
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-05 14:01:41
 */
import { assert } from 'devlevel'
import VComplexElement from './VComplexElement'
import { parsePath } from '../common'
import { observer } from '../observer'
import { inherit, hasOwnProp, isObj } from '../helper'

export default inherit(
	function Compontent(scope, option) {
		VComplexElement.call(this, this, option)

		let comp = null
		if (!isObj(scope)) {
			assert(scope && scope.$comp, 'Require Parent Compontent')
			comp = scope
			scope = comp.$scope
		}
		const obs = observer(scope)
		this.scope = obs.proxy
		this.$scope = obs.source
		this.$observer = obs
		this.parent = comp
	},
	VComplexElement,
	{
		$comp: true,
		prepare(option) {},
		initAttrs() {},
		$getScope(attr) {
			let $observer = this.$observer,
				parent
			while (!hasOwnProp($observer.source, attr) && (parent = $observer.$parent) && attr in parent.source) $observer = parent
			return $observer
		},
		getScope(attr) {
			return this.$getScope(attr).proxy
		},
		observe(path, cb, scope) {
			path = parsePath(path)
			this.$getScope(path[0]).observe(path, cb, scope)
			return this
		},
		unobserve(path, cb, scope) {
			this.$getScope(path[0]).unobserve(path, cb, scope)
			return this
		},
		observeExpr(expr, cb, scope) {
			const identities = expr.identities,
				l = identities.length
			for (var i = 0; i < l; i++) this.observe(identities[i], cb, scope)
			return this
		},
		unobserveExpr(expr, cb, scope) {
			const identities = expr.identities,
				l = identities.length
			for (var i = 0; i < l; i++) this.unobserve(identities[i], cb, scope)
			return this
		},
		onProxyChange(fn, scope) {
			this.$observer.onProxyChange(fn, scope)
			return this
		},
		unProxyChange(fn, scope) {
			this.$observer.unProxyChange(fn, scope)
			return this
		},
		destroy() {},
	}
)
