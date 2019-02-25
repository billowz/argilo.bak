/**
 * Double Linked List
 * @module utility/List
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Fri Feb 22 2019 16:45:27 GMT+0800 (China Standard Time)
 */

import { bind } from '../fn'
import { defPropValue } from '../prop'
import { assert } from '../assert'
import { EMPTY_FN } from '../consts'

const DEFAULT_BINDING = '__list__'

interface ListNode<T> extends Array<any> {
	0: T
	1?: ListNode<T>
	2?: ListNode<T>
	3?: List<T>
	toJSON?: () => any
}
//type ListNode = [ListElement, IListNode, IListNode, List]

export class List<T> {
	static readonly binding: string = DEFAULT_BINDING

	readonly binding: string
	private __head?: ListNode<T>
	private __tail?: ListNode<T>
	private __length: number = 0
	private __scaning: boolean = false
	private __lazyRemoves?: ListNode<T>[]
	constructor(binding?: string) {
		this.binding = binding || DEFAULT_BINDING
	}
	size(): number {
		return this.__length
	}
	has(obj: T): boolean {
		const node: ListNode<T> = obj[this.binding]
		return node ? node[0] === obj && node[3] === this : false
	}
	/**
	 *
	 * @param obj
	 * @return new length
	 */
	add(obj: T): number {
		return this.__insert(obj, this.__tail)
	}
	/**
	 *
	 * @param obj
	 * @return new length
	 */
	addFirst(obj: T): number {
		return this.__insert(obj)
	}
	/**
	 *
	 * @param obj
	 * @return new length
	 */
	insertAfter(obj: T, target?: T): number {
		return this.__insert(obj, target && this.__getNode(target))
	}
	/**
	 *
	 * @param obj
	 * @return new length
	 */
	insertBefore(obj: T, target?: T): number {
		return this.__insert(obj, target && this.__getNode(target)[1])
	}
	/**
	 *
	 * @param objs
	 * @return new length
	 */
	addAll(objs: T[]): number {
		return this.__insertAll(objs, this.__tail)
	}
	addFirstAll(objs: T[]): number {
		return this.__insertAll(objs)
	}
	insertAfterAll(objs: T[], target?: T): number {
		return this.__insertAll(objs, target && this.__getNode(target))
	}
	insertBeforeAll(objs: T[], target?: T): number {
		return this.__insertAll(objs, target && this.__getNode(target)[1])
	}
	prev(obj: T): T {
		return this.__siblingObj(obj, 1)
	}
	next(obj: T): T {
		return this.__siblingObj(obj, 2)
	}
	first(): T {
		const node: ListNode<T> = this.__head
		return node && node[0]
	}
	last(): T {
		const node: ListNode<T> = this.__tail
		return node && node[0]
	}
	each(cb: (obj: T) => boolean | void, scope?: any) {
		if (this.__length) {
			assert.not(this.__scaning, 'Nested calls are not allowed.')
			this.__scaning = true
			cb = bind(cb, scope)
			var node = this.__head
			while (node) {
				if (node[3] === this && cb(node[0]) === false) break
				node = node[2]
			}
			this.__doLazyRemove()
			this.__scaning = false
		}
	}
	toArray(): T[] {
		const array: T[] = new Array(this.__length)
		let node = this.__head,
			i = 0
		while (node) {
			if (node[3] === this) array[i++] = node[0]
			node = node[2]
		}
		return array
	}
	/**
	 *
	 * @param obj
	 * @return new length
	 */
	remove(obj: T): number {
		return this.__remove(this.__getNode(obj))
	}
	pop() {}
	clean() {
		if (this.__length) {
			if (this.__scaning) {
				var node = this.__head
				while (node) {
					node[3] === this && this.__lazyRemove(node)
					node = node[2]
				}
				this.__length = 0
			} else {
				this.__clean()
			}
		}
	}

	private __initNode(obj: T): ListNode<T> {
		const { binding } = this
		let node: ListNode<T> = obj[binding]
		if (node && node[0] === obj) {
			if (node[3] === this) {
				this.__remove(node)
				return this.__initNode(obj)
			} else if (node[3]) {
				assert('Object is still in some List')
			}
		} else {
			node = [obj]
			node.toJSON = EMPTY_FN
			defPropValue(obj, binding, node, false)
		}
		node[3] = this
		return node
	}

	private __getNode(obj: T): ListNode<T> {
		const node: ListNode<T> = obj[this.binding]
		assert.is(node && node[3] === this, 'Object is not in this List')
		return node
	}

	private __siblingObj(obj: T, siblingIdx: number): T {
		const node: ListNode<T> = this.__getNode(obj)
		let sibling: ListNode<T> = node[siblingIdx]
		if (sibling) {
			while (!sibling[3]) {
				sibling = sibling[siblingIdx]
				if (!sibling) return
			}
			return sibling[0]
		}
	}

	private __doInsert(nodeHead: ListNode<T>, nodeTail: ListNode<T>, len: number, prev?: ListNode<T>): number {
		let next: ListNode<T>
		nodeHead[1] = prev
		if (prev) {
			nodeTail[2] = next = prev[2]
			prev[2] = nodeHead
		} else {
			nodeTail[2] = next = this.__head
			this.__head = nodeHead
		}
		if (next) next[1] = nodeTail
		else this.__tail = nodeTail
		return (this.__length += len)
	}

	private __insert(obj: T, prev?: ListNode<T>): number {
		const node = this.__initNode(obj)
		return this.__doInsert(node, node, 1, prev)
	}

	private __insertAll(objs: T[], prev?: ListNode<T>): number {
		let l = objs.length
		if (l) {
			const head = this.__initNode(objs[0])
			var __prev = head,
				tail = head,
				i = 1
			for (; i < l; i++) {
				tail = this.__initNode(objs[i])
				tail[1] = __prev
				__prev[2] = tail
				__prev = tail
			}
			return this.__doInsert(head, tail, l, prev)
		}
		return -1
	}

	private __remove(node: ListNode<T>): number {
		this.__scaning ? this.__lazyRemove(node) : this.__doRemove(node)
		return --this.__length
	}

	private __lazyRemove(node: ListNode<T>): void {
		const { __lazyRemoves: lazyRemoves } = this
		node[0][this.binding] = undefined // unbind this node
		node[3] = null
		if (lazyRemoves) {
			lazyRemoves.push(node)
		} else {
			this.__lazyRemoves = [node]
		}
	}

	private __doLazyRemove() {
		const { __lazyRemoves: lazyRemoves } = this
		if (lazyRemoves) {
			var len = lazyRemoves.length
			if (len) {
				if (this.__length) {
					while (len--) this.__doRemove(lazyRemoves[len])
				} else {
					this.__clean()
				}
				lazyRemoves.length = 0
			}
		}
	}

	private __doRemove(node: ListNode<T>) {
		const prev = node[1],
			next = node[2]
		if (prev) {
			prev[2] = next
		} else {
			this.__head = next
		}
		if (next) {
			next[1] = prev
		} else {
			this.__tail = prev
		}
		node[1] = node[2] = node[3] = null
	}

	private __clean() {
		let node: ListNode<T>,
			next = this.__head
		while ((node = next)) {
			next = node[2]
			node.length = 1
		}
		this.__head = undefined
		this.__tail = undefined
		this.__length = 0
	}
}
