/**
 * @module vnode
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:30:30 GMT+0800 (China Standard Time)
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
			while (!hasOwnProp($observer.source, attr) && (parent = $observer.$parent) && attr in parent.source)
				$observer = parent
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
		destroy() {}
	}
)
