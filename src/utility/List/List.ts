/**
 * Double Linked List
 * @module utility/List
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Mon Dec 10 2018 19:07:47 GMT+0800 (China Standard Time)
 */

import { bind } from '../fn'
import { defPropValue } from '../prop'
import { assert } from '../assert'

const DEFAULT_BINDING = '__this__'

interface ListNode<T> extends Array<any> {
	0: T
	1?: ListNode<T>
	2?: ListNode<T>
	3?: List<T>
}
//type ListNode = [ListElement, IListNode, IListNode, List]

export class List<T> {
	static readonly binding: string = DEFAULT_BINDING

	readonly binding: string
	protected head?: ListNode<T>
	protected tail?: ListNode<T>
	protected length: number = 0
	protected scaning: boolean = false
	protected lazyRemoves?: ListNode<T>[]
	constructor(binding?: string) {
		this.binding = binding || DEFAULT_BINDING
	}
	size(): number {
		return this.length
	}
	has(obj: T): boolean {
		const node: ListNode<T> = obj[this.binding]
		return node ? node[0] === obj && node[3] === this : false
	}
	add(obj: T): number {
		return this.__insert(obj, this.tail)
	}
	addFirst(obj: T): number {
		return this.__insert(obj)
	}
	insertAfter(obj: T, target?: T): number {
		return this.__insert(obj, target && this.__getNode(target))
	}
	insertBefore(obj: T, target?: T): number {
		return this.__insert(obj, target && this.__getNode(target)[1])
	}
	addAll(objs: T[]): number {
		return this.__insertAll(objs, this.tail)
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
		const node: ListNode<T> = this.head
		return node && node[0]
	}
	last(): T {
		const node: ListNode<T> = this.tail
		return node && node[0]
	}
	each(cb: (obj: T) => boolean | void, scope?: any) {
		if (this.length) {
			assert.not(this.scaning, 'Recursive calls are not allowed.')
			this.scaning = true
			cb = bind(cb, scope)
			var node = this.head
			while (node) {
				if (node[3] === this && cb(node[0]) === false) break
				node = node[2]
			}
			this.__doLazyRemove()
			this.scaning = false
		}
	}
	toArray(): T[] {
		const array: T[] = new Array(this.length)
		let node = this.head,
			i = 0
		while (node) {
			if (node[3] === this) array[i++] = node[0]
			node = node[2]
		}
		return array
	}
	remove(obj: T): number {
		return this.__remove(this.__getNode(obj))
	}
	pop(){

	}
	clean() {
		if (this.length) {
			if (this.scaning) {
				var node = this.head
				while (node) {
					node[3] === this && this.__lazyRemove(node)
					node = node[2]
				}
				this.length = 0
			} else {
				this.__clean()
			}
		}
	}
	toJSON(){}

	protected __initNode(obj: T): ListNode<T> {
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
			defPropValue(obj, binding, node, false)
		}
		node[3] = this
		return node
	}

	protected __getNode(obj: T): ListNode<T> {
		const node: ListNode<T> = obj[this.binding]
		assert.is(node && node[3] === this, 'Object is not in this List')
		return node
	}

	protected __siblingObj(obj: T, siblingIdx: number): T {
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
		let next
		nodeHead[1] = prev
		if (prev) {
			nodeTail[2] = next = prev[2]
			prev[2] = nodeHead
		} else {
			nodeTail[2] = next = this.head
			this.head = nodeHead
		}
		if (next) next[1] = nodeTail
		else this.tail = nodeTail
		return (this.length += len)
	}

	protected __insert(obj: T, prev?: ListNode<T>): number {
		const node = this.__initNode(obj)
		return this.__doInsert(node, node, 1, prev)
	}

	protected __insertAll(objs: T[], prev?: ListNode<T>): number {
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

	protected __remove(node: ListNode<T>): number {
		this.scaning ? this.__lazyRemove(node) : this.__doRemove(node)
		return --this.length
	}

	protected __lazyRemove(node: ListNode<T>): void {
		const { lazyRemoves } = this
		node[0][this.binding] = undefined // unbind this node
		node[3] = null
		if (lazyRemoves) {
			lazyRemoves.push(node)
		} else {
			this.lazyRemoves = [node]
		}
	}

	protected __doLazyRemove() {
		const { lazyRemoves } = this
		if (lazyRemoves) {
			var len = lazyRemoves.length
			if (len) {
				if (this.length) {
					while (len--) this.__doRemove(lazyRemoves[len])
				} else {
					this.__clean()
				}
				lazyRemoves.length = 0
			}
		}
	}

	protected __doRemove(node: ListNode<T>) {
		const prev = node[1],
			next = node[2]
		if (prev) {
			prev[2] = next
		} else {
			this.head = next
		}
		if (next) {
			next[1] = prev
		} else {
			this.tail = prev
		}
		node[1] = node[2] = node[3] = null
	}

	protected __clean() {
		let node,
			next = this.head
		while ((node = next)) {
			next = node[2]
			node.length = 1
		}
		this.head = undefined
		this.tail = undefined
		this.length = 0
	}
}
