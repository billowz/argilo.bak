/**
 * Double Linked List
 * @module utility/List
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Tue Nov 27 2018 19:56:25 GMT+0800 (China Standard Time)
 */

import { bind } from '../fn'
import { defPropValue } from '../prop'

export const DEFAULT_BINDING = '__list__'

export type ListElement = object | any[] | Function
interface ListNode extends Array<any> {
	0: ListElement
	1?: ListNode
	2?: ListNode
	3?: List
}
//type ListNode = [ListElement | void, IListNode | void, IListNode | void, List]

export class List {
	static binding: string = DEFAULT_BINDING

	length: number = 0
	head?: ListNode
	tail?: ListNode
	binding: string
	scaning: boolean = false
	lazyRemoves?: ListNode[]
	constructor(binding?: string) {
		this.binding = binding || DEFAULT_BINDING
	}
	has(obj: ListElement): boolean {
		const node: ListNode | void = obj[this.binding]
		return node ? node[0] === obj && node[3] === this : false
	}
	add(obj: ListElement): number {
		return __insert(this, obj, this.tail)
	}
	addFirst(obj: ListElement): number {
		return __insert(this, obj)
	}
	insertAfter(obj: ListElement, target?: ListElement): number {
		return __insert(this, obj, target && __getNode(this, target))
	}
	insertBefore(obj: ListElement, target?: ListElement): number {
		return __insert(this, obj, target && __getNode(this, target)[1])
	}
	addAll(objs: ListElement[]): number {
		return __insertAll(this, objs, this.tail)
	}
	addFirstAll(objs: ListElement[]): number {
		return __insertAll(this, objs)
	}
	insertAfterAll(objs: ListElement[], target?: ListElement): number {
		return __insertAll(this, objs, target && __getNode(this, target))
	}
	insertBeforeAll(objs: ListElement[], target?: ListElement): number {
		return __insertAll(this, objs, target && __getNode(this, target)[1])
	}
	prev(obj: ListElement): ListElement {
		return __siblingObj(this, obj, 1)
	}
	next(obj: ListElement): ListElement {
		return __siblingObj(this, obj, 2)
	}
	first(): ListElement {
		const node: ListNode = this.head
		return node && node[0]
	}
	last(): ListElement {
		const node: ListNode = this.tail
		return node && node[0]
	}
	remove(obj: ListElement): number {
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
	}
	each(cb: (obj: ListElement) => boolean | void, scope?: any) {
		if (!this.scaning) throw new Error('Recursive calls are not allowed.')
		if (this.length) {
			this.scaning = true
			cb = bind(cb, scope)
			var node = this.head
			while (node) {
				if (node[3] === this && cb(node[0]) === false) break
				node = node[2]
			}
			__doLazyRemove(this)
			this.scaning = false
		}
	}
	toArray(): ListElement[] {
		const array: ListElement[] = new Array(this.length)
		let node = this.head,
			i = 0
		while (node) {
			if (node[3] === this) array[i++] = node[0]
			node = node[2]
		}
		return array
	}
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
	}
	clone(cb: (obj: ListElement) => ListElement, scope?: any) {
		const newlist = new List(this.binding)
		if (this.length) {
			cb = bind(cb, scope)
			var node = this.head,
				newtail,
				newhead,
				newprev = undefined,
				i = 0
			while (node) {
				if (node[3] === this && (newtail = cb(node[0]))) {
					newtail = __initNode(newlist, newtail)

					if (!newtail[3]) throw new Error('Double add List, Clone Callback should return a new Object')

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
	}
}

function __doInsert(list: List, nodeHead: ListNode, nodeTail: ListNode, len: number, prev?: ListNode): number {
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

function __insert(list: List, obj: ListElement, prev?: ListNode): number {
	const node = __initNode(list, obj)
	if (!node[3]) {
		node[3] = list
		return __doInsert(list, node, node, 1, prev)
	}
}

function __insertAll(list: List, objs: ListElement[], prev?: ListNode): number {
	let l = objs.length
	if (l) {
		const head = __initNode(list, objs[0])

		if (!head[3]) throw new Error('Double add List, Object have added in this List')

		head[3] = list

		var __prev = head,
			tail = head,
			i = 1
		for (; i < l; i++) {
			tail = __initNode(list, objs[i])

			if (!tail[3]) throw new Error('Double add List, Object have added in this List')

			tail[3] = list
			tail[1] = __prev
			__prev[2] = tail
			__prev = tail
		}
		return __doInsert(list, head, tail, l, prev)
	}
}

function __initNode(list: List, obj: ListElement): ListNode {
	const { binding } = list
	let node: ListNode | void = obj[binding]
	if (node && node[0] === obj) {
		if (!node[3] || node[3] === list) throw new Error('Double add List, Object is still in other List')
	} else {
		node = [obj]
		defPropValue(obj, binding, node, true, true)
	}
	return node
}

function __getNode(list: List, obj: ListElement): ListNode {
	const node: ListNode | void = obj[list.binding]
	if (node && node[0] === obj) {
		if (node[3] === list) throw new Error('Object is not in this List')
		return node
	}
	throw new Error('Object is not in List')
}

function __siblingObj(list: List, obj: ListElement, siblingIdx: number): ListElement {
	const node: ListNode = __getNode(list, obj)
	let sibling: ListNode = node[siblingIdx]
	if (sibling) {
		while (!sibling[3]) {
			sibling = sibling[siblingIdx]
			if (!sibling) return
		}
		return sibling[0]
	}
}

function __remove(list: List, node: ListNode) {
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

function __clean(list: List) {
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

function __doLazyRemove(list: List) {
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
/*
export default function List(binding?: string) {
	this.binding = binding || DEFAULT_BINDING
}

defPropValue(List, 'binding', DEFAULT_BINDING)

inherit(List, {
	length: 0,
	has(obj: ListElement): boolean {
		const node?:ListNode = obj[this.binding]
		return node ? node[0] === obj && node[3] === this : false
	},
	add(obj: ListElement) {
		return __insert(this, obj, this.tail)
	},
	addFirst(obj: ListElement) {
		return __insert(this, obj)
	},
	insertAfter(obj: ListElement, target?:ListElement) {
		return __insert(this, obj, target && __getNode(this, target))
	},
	insertBefore(obj: ListElement, target?:ListElement) {
		return __insert(this, obj, target && __getNode(this, target)[1])
	},
	addAll(objs: ListElement[]) {
		return __insertAll(this, objs, this.tail)
	},
	addFirstAll(objs: ListElement[]) {
		return __insertAll(this, objs)
	},
	insertAfterAll(objs: ListElement[], target?:ListElement) {
		return __insertAll(this, objs, target && __getNode(this, target))
	},
	insertBeforeAll(objs: ListElement[], target?:ListElement) {
		return __insertAll(this, objs, target && __getNode(this, target)[1])
	},
	prev(obj: ListElement): ListElement {
		return __siblingObj(this, obj, 1)
	},
	next(obj: ListElement): ListElement {
		return __siblingObj(this, obj, 2)
	},
	first(): ListElement {
		const node?:ListNode = this.head
		return node && node[0]
	},
	last(): ListElement {
		const node?:ListNode = this.tail
		return node && node[0]
	},
	remove(obj: ListElement) {
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
	each(cb, scope?: any) {
		assert(!this.scaning, 'Recursive calls are not allowed.')
		this.scaning = true
		cb = bind(cb, scope)
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
	}
})

function __doInsert(list: List, nodeHead: ListNode, nodeTail: ListNode, len: number, prev?:ListNode) {
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

function __initNode(list: List, obj: ListElement): ListNode {
	const { binding } = list
	let node?:ListNode = obj[binding]
	if (node && node[0] === obj) {
		assert(!node[3] || node[3] === list, 'Double add List, Object is still in other List')
	} else {
		node = defPropValue(obj, binding, [obj], true, true)
	}
	return node
}

function __getNode(list: List, obj: ListElement): ListNode {
	const node?:ListNode = obj[list.binding]
	if (node && node[0] === obj) {
		assert(node[3] === list, 'Object is not in this List')
		return node
	}
	assert(0, 'Object is not in List')
}

function __siblingObj(list: List, obj: ListElement, siblingIdx: number): ListElement {
	const node: ListNode = __getNode(list, obj)
	let sibling: ListNode = node[siblingIdx]
	if (sibling) {
		while (!sibling[3]) {
			sibling = sibling[siblingIdx]
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
*/
