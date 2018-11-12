/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:35:58
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-10-20 13:09:21
 */
import { assert } from 'devlevel'
import { inherit } from '../helper'

export const CHILD_NODES = 'childNodes',
	PARENT = 'parent',
	VIRT_NODE = '$virtNode',
	VIRT_ELEMENT = '$virtElement',
	VIRT_TEXT = '$virtText',
	VIRT_BINDING_TEXT = '$virtBindingText',
	VIRT_COMPLEX_ELEMENT = '$virtComplexElement',
	VIRT_COMMENT = '$virtComment'

export default inherit(
	function VNode(comp) {
		assert(comp.$comp, 'Require Compontent')
		this.comp = comp
	},
	{
		[VIRT_NODE]: true,
		prepare() {},
		mount() {},
		unmount() {},
		appendTo(parent) {
			assert(parent.$virtComplexElement, 'parent should be Virtual Complex Element')

			return parent.append(this)
		},
		prependTo(parent) {
			assert(parent.$virtComplexElement, 'parent should be Virtual Complex Element')

			return parent.prepend(this)
		},
		insertBeforeTo(target) {
			assert(target[PARENT], 'target is Root Node')
			assert(target[VIRT_NODE], 'target should be Virtual Node')

			return target[PARENT].insertBefore(this, target)
		},
		insertAfterTo(target) {
			assert(target[PARENT], 'target is Root Node')
			assert(target[VIRT_NODE], 'target should be Virtual Node')

			return target[PARENT].insertAfter(this, target)
		},
		replaceTo(target) {
			assert(target[PARENT], 'target is Root Node')
			assert(target[VIRT_NODE], 'target should be Virtual Node')

			return target[PARENT].replace(this, target)
		},
		prevSibling() {
			const parent = this[PARENT]
			return parent && parent[CHILD_NODES].prev(this)
		},
		nextSibling() {
			const parent = this[PARENT]
			return parent && parent[CHILD_NODES].next(this)
		},
		remove() {
			const parent = this[PARENT]
			if (parent) {
				parent[CHILD_NODES].remove(this)
				this[PARENT] = undefined
			}
			return this
		},
	}
)
