/*
 * Double Linked List
 *
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-07-23 16:07:38
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-06 14:21:28
 */
import { assert } from 'devlevel'
import { inherit, defPropValue } from '../helper'

export const DEFAULT_BINDING = '__list__'

export default function List(binding) {
	this.binding = binding || DEFAULT_BINDING
}

defPropValue(List, 'binding', DEFAULT_BINDING)

inherit(List, {
	length: 0,
	has(obj) {
		const node = obj[this.binding]
		return node ? node[0] === obj && node[3] === this : false
	},
	add(obj) {
		return __insert(this, obj, this.tail)
	},
	addFirst(obj) {
		return __insert(this, obj)
	},
	insertAfter(obj, target) {
		return __insert(this, obj, target && __getNode(this, target))
	},
	insertBefore(obj, target) {
		return __insert(this, obj, target && __getNode(this, target)[1])
	},
	addAll(objs) {
		return __insertAll(this, objs, this.tail)
	},
	addFirstAll(objs) {
		return __insertAll(this, objs)
	},
	insertAfterAll(objs, target) {
		return __insertAll(this, objs, target && __getNode(this, target))
	},
	insertBeforeAll(objs, target) {
		return __insertAll(this, objs, target && __getNode(this, target)[1])
	},
	prev(obj) {
		return __siblingObj(this, obj, 1)
	},
	next(obj) {
		return __siblingObj(this, obj, 2)
	},
	first() {
		const node = this.head
		return node && node[0]
	},
	last() {
		const node = this.tail
		return node && node[0]
	},
	remove(obj) {
		const node = __getNode(this, obj)
		if (this.scaning) {
			const { lazyRemoves } = this
			obj[this.binding] = undefined // unbind list node
			node[3] = undefined
			if (lazyRemoves) {
				lazyRemoves.push(node)
			} else {
				this.lazyRemoves = [node]
			}
		} else {
			__remove(this, node)
		}
		return --this.length
	},
	each(cb, scope) {
		assert(!this.scaning, 'Recursive calls are not allowed.')
		this.scaning = true
		if (scope) cb = cb.bind(scope)
		let node = this.head
		while (node) {
			if (node[3] === this && cb(node[0]) === false) break
			node = node[2]
		}
		__doLazyRemove(this)
		this.scaning = false
	},
	toArray() {
		const array = new Array(this.length)
		let node = this.head,
			i = 0
		while (node) {
			if (node[3] === this) array[i++] = node[0]
			node = node[2]
		}
		return array
	},
	clean() {
		if (this.length) {
			if (this.scaning) {
				const { binding } = this
				const lazyRemoves = this.lazyRemoves || (this.lazyRemoves = [])
				var node = this.head
				while (node) {
					if (node[3] === this) {
						node[0][binding] = undefined
						lazyRemoves.push(node)
					}
					node = node[2]
				}
				this.length = 0
			} else {
				__clean(this)
			}
		}
	},
	clone(cb, scope) {
		const newlist = new List(this.binding)
		if (this.length) {
			if (scope) cb = cb.bind(scope)
			var node = this.head,
				newtail,
				newhead,
				newprev = undefined,
				i = 0
			while (node) {
				if (node[3] === this && (newtail = cb(node[0]))) {
					newtail = __initNode(newlist, newtail)
					assert(!newtail[3], 'Double add List, Clone Callback should return a new Object')
					newtail[3] = newlist
					if (newprev) {
						newtail[1] = newprev
						newprev[2] = newtail
						newprev = newtail
					} else {
						newprev = newhead = newtail
					}
					i++
				}
				node = node[2]
			}
			i && __doInsert(newlist, newhead, newtail, i)
		}
		return newlist
	},
})

function __doInsert(list, nodeHead, nodeTail, len, prev) {
	let next
	nodeHead[1] = prev
	if (prev) {
		nodeTail[2] = next = prev[2]
		prev[2] = nodeHead
	} else {
		nodeTail[2] = next = list.head
		list.head = nodeHead
	}
	if (next) next[1] = nodeTail
	else list.tail = nodeTail
	return (list.length += len)
}

function __insert(list, obj, prev) {
	const node = __initNode(list, obj)
	if (!node[3]) {
		node[3] = list
		return __doInsert(list, node, node, 1, prev)
	}
}

function __insertAll(list, objs, prev) {
	let l = objs.length
	if (!l) return
	const head = __initNode(list, objs[0])
	assert(!head[3], 'Double add List, Object have added in this List')
	head[3] = list
	let __prev = head,
		tail = head,
		i = 1
	for (; i < l; i++) {
		tail = __initNode(list, objs[i])
		assert(!tail[3], 'Double add List, Object have added in this List')
		tail[3] = list
		tail[1] = __prev
		__prev[2] = tail
		__prev = tail
	}
	return __doInsert(list, head, tail, l, prev)
}

function __initNode(list, obj) {
	const { binding } = list
	let node = obj[binding]
	if (node && node[0] === obj) {
		assert(!node[3] || node[3] === list, 'Double add List, Object is still in other List')
	} else {
		node = defPropValue(obj, binding, [obj], true, true)
	}
	return node
}

function __getNode(list, obj) {
	const node = obj[list.binding]
	if (node && node[0] === obj) {
		assert(node[3] === list, 'Object is not in this List')
		return node
	}
	assert(0, 'Object is not in List')
}

function __siblingObj(list, obj, key) {
	const node = __getNode(list, obj)
	let sibling = node[key]
	if (sibling) {
		while (!sibling[3]) {
			sibling = sibling[key]
			if (!sibling) return
		}
		return sibling[0]
	}
}

function __remove(list, node) {
	const prev = node[1],
		next = node[2]
	if (prev) {
		prev[2] = next
	} else {
		list.head = next
	}
	if (next) {
		next[1] = prev
	} else {
		list.tail = prev
	}
	node.length = 1
}

function __clean(list) {
	let node,
		next = list.head
	while ((node = next)) {
		next = node[2]
		node.length = 1
	}
	list.head = undefined
	list.tail = undefined
	list.length = 0
}

function __doLazyRemove(list) {
	const { lazyRemoves } = list
	if (lazyRemoves) {
		var len = lazyRemoves.length
		if (len) {
			if (list.length) {
				while (len--) __remove(list, lazyRemoves[len])
			} else {
				__clean(list)
			}
			lazyRemoves.length = 0
		}
	}
}
