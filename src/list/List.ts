/**
 * Double Linked List
 * @module util/list
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 18:28:27 GMT+0800 (China Standard Time)
 */

import { bind, defValue, addDKey } from '../util'
import { assert } from '../assert'
import { EMPTY_FN } from '../util/consts'

const DEFAULT_BINDING = addDKey('__list__')

interface ListNode<T> extends Array<any> {
	0: T // target
	1: ListNode<T> // prev node
	2: ListNode<T> // next node
	3: List<T> // list
	4: number // version
	toJSON?: () => any
}

export class List<T> {
	static readonly binding: string = DEFAULT_BINDING

	readonly binding: string
	private __head?: ListNode<T>
	private __tail?: ListNode<T>
	private __length: number = 0
	private __scaning: boolean = false
	private __lazyRemoves?: ListNode<T>[]
	private __ver: number = 0
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

			const __ver = ++this.__ver

			cb = bind(cb, scope)
			var node = this.__head,
				err: Error

			while (node) {
				if (node[3] === this) {
					if (__ver === node[4]) break
					try {
						if (cb(node[0]) === false) break
					} catch (e) {
						err = e
					}
				}
				node = node[2]
			}
			this.__doLazyRemove()
			this.__scaning = false
			if (err) throw err
		}
	}
	eachUnsafe(cb: (obj: T) => boolean | void, scope?: any) {
		if (this.__length) {
			var node = this.__head
			while (node) {
				if (node[3] === this && cb(node[0]) === false) break
				node = node[2]
			}
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
			node[3] = this
			node[4] = this.__ver
		} else {
			node = [obj, , , this, this.__ver]
			node.toJSON = EMPTY_FN
			defValue(obj, binding, node, false)
		}
		return node
	}

	private __getNode(obj: T): ListNode<T> {
		const node: ListNode<T> = obj[this.binding]
		assert.is(node && node[0] === obj && node[3] === this, 'Object is not in this List')
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
		node[0][this.binding] = null // unbind this node
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
		node.length = 1
	}

	private __clean() {
		let node: ListNode<T>,
			next = this.__head
		while ((node = next)) {
			next = node[2]
			node.length = 1
		}
		this.__head = null
		this.__tail = null
		this.__length = 0
	}
}
