/**
 * @module vnode
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:32:23 GMT+0800 (China Standard Time)
 */
import { assert } from 'devlevel'
import VNode, { VIRT_ELEMENT } from './VNode'
import { inherit, fnName } from '../helper'
import { PROTOTYPE } from '../helper/consts'

export default inherit(
	function VElement(comp, option) {
		VNode.call(this, comp)
		this.init(option)
		this.initAttrs(option.attrs)
		this.initDirectives(option.directives)
	},
	VNode,
	{
		[VIRT_ELEMENT]: true,
		prepare(option) {
			const { directives } = option
			if (directives) {
				const l = directives.length
				assert.by(l, () => {
					for (var i = 0, g, D; i < l; i++) {
						g = directives[i]
						D = g.Directive
						assert(
							this[D[PROTOTYPE].$nodeKey],
							`Can not bind directive[${g.dname}: ${fnName(D)}] on ${fnName(this.constructor)}, require ${
								D[PROTOTYPE].$nodeName
							}`
						)
					}
				})
				if (!l) option.directives = null
			}
		},
		init() {},
		initDirectives(directives) {
			if (directives) {
				const l = directives.length,
					__directives = new Array(l)
				for (var i = 0; i < l; i++) __directives[i] = directives[i](this)
				this.directives = __directives
			}
		},
		mount() {
			const { directives } = this
			if (directives) {
				const l = directives.length
				for (var i = 0; i < l; i++) directives[i].bind()
			}
		},
		unmount() {
			const { directives } = this
			if (directives) {
				var i = directives.length
				while (i--) directives[i].unbind()
			}
		}
	}
)
