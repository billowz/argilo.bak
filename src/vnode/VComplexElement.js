/**
 * @module vnode
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:32:27 GMT+0800 (China Standard Time)
 */
import { assert } from 'devlevel'
import { VIRT_NODE, VIRT_COMPLEX_ELEMENT, CHILD_NODES } from './VNode'
import VElement from './VElement'
import { List } from '../common'
import { inherit } from '../helper'
import { PROTOTYPE } from '../helper/consts'

const { prepare, mount, unmount } = VElement[PROTOTYPE]

export default inherit(
	function VComplexElement(comp, option) {
		VElement.call(this, comp, option)
		this.initChildren(option.children)
	},
	VElement,
	{
		[VIRT_COMPLEX_ELEMENT]: true,
		$childKey: VIRT_NODE,
		$childName: 'Virtual Node',
		prepare(option, N) {
			prepare.call(this, option, N)
			const children = option.children
			if (children) {
				const l = children.length
				for (var i = 0, N; i < l; i++) {
					N = children[i].VNode
					assert(
						N[PROTOTYPE][this.$childKey],
						`Child Node[${i}: ${children[i].ename}] should be ${this.$childName}`
					)
				}
			}
		},
		initChildren(children) {
			const childNodes = (this[CHILD_NODES] = new List())
			const l = children.length
			const __children = new Array(l)
			for (var i = 0, child; i < l; i++) {
				__children[i] = child = children[i](this.comp)
				child.parent = this
				this.initChild(child)
			}
			childNodes.addAll(__children)
		},
		initChild(child) {},
		mount() {
			mount.call(this)
			this[CHILD_NODES].each(mountChildHandler)
		},
		unmount() {
			this[CHILD_NODES].each(unmountChildHandler)
			unmount.call(this)
		},
		childCount() {
			return this[CHILD_NODES].length
		},
		first() {
			return this[CHILD_NODES].first()
		},
		last() {
			return this[CHILD_NODES].last()
		},
		prev: createSibling('prev'),
		next: createSibling('next'),
		append: createInsert('add'),
		prepend: createInsert('addFirst'),
		insertBefore: createInsertSibling('insertBefore'),
		insertAfter: createInsertSibling('insertAfter'),
		replace(node, target) {
			assert(node[this.$childKey], `node should be ${this.$childName}`)
			assert(this[CHILD_NODES].has(target), `target is not existing in this Node`)

			node.remove()
			this[CHILD_NODES].insert(node, target)
			target.remove()
			node.parent = this
			return this
		},
		eachChildren(cb, scope) {
			return this[CHILD_NODES].each(cb, scope)
		}
	}
)

function createSibling(get) {
	return function(node) {
		assert(node[this.$childKey], `node should be ${this.$childName}`)

		return this[CHILD_NODES][get](node)
	}
}

function createInsert(insert) {
	return function(node) {
		assert(node[this.$childKey], `node should be ${this.$childName}`)

		node.remove()
		this[CHILD_NODES][insert](node)
		node.parent = this
	}
	return this
}

function createInsertSibling(insert) {
	return function(node, target) {
		assert(node[this.$childKey], `node should be ${this.$childName}`)
		assert(this[CHILD_NODES].has(target), `target is not existing in this Node`)

		node.remove()
		this[CHILD_NODES][insert](node, target)
		node.parent = this
		return this
	}
}

function mountChildHandler(child) {
	child.mount()
}

function unmountChildHandler(child) {
	child.unmount()
}
