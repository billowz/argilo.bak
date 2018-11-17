import { VIRT_NODE } from '../vnode/VNode'
import {
	PARENT_NODE,
	APPEND_CHILD,
	REMOVE_CHILD,
	REPLACE_CHILD,
	query,
	prependChild,
	insertAfter,
	insertBefore
} from './util/util'
import { PROTOTYPE } from '../helper/consts'

export default function(VNode) {
	const remove = VNode[PROTOTYPE].remove
	return {
		$htmlNode: true,
		appendTo(parent) {
			if (parent[VIRT_NODE]) {
				parent.append(this)
			} else {
				query(parent)[APPEND_CHILD](this.el)
			}
			return this
		},
		prependTo(parent) {
			if (parent[VIRT_NODE]) {
				parent.prepend(this)
			} else {
				prependChild(query(parent), this.el)
			}
			return this
		},
		insertBeforeTo(target) {
			if (target[VIRT_NODE]) {
				target.parent.insertBefore(this, target)
			} else {
				insertAfter(this.el, query(target))
			}
			return this
		},
		insertAfterTo(target) {
			if (target[VIRT_NODE]) {
				target.parent.insertAfter(this, target)
			} else {
				insertBefore(this.el, query(target))
			}
			return this
		},
		replaceTo(target) {
			if (target[VIRT_NODE]) {
				target.parent.replace(this, target)
			} else {
				taget = query(target)
				target[PARENT_NODE][REPLACE_CHILD](this.el, target)
			}
			return this
		},
		remove() {
			const el = this.el,
				pEl = el[PARENT_NODE]
			pEl && pEl[REMOVE_CHILD](el)
			return remove.call(this)
		}
	}
}
