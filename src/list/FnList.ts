/**
 * Function List
 * @module util/list
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Mon Apr 08 2019 14:05:16 GMT+0800 (China Standard Time)
 */

import { List } from './List'
import { create, defValue, addDKey } from '../util'

const DEFAULT_FN_BINDING = addDKey('__flist_id__')
const DEFAULT_SCOPE_BINDING = addDKey(DEFAULT_FN_BINDING)

type FnNode<T extends Function> = [string, T, any, any]
export class FnList<T extends Function> {
	static readonly fnBinding: string = DEFAULT_FN_BINDING
	static readonly scopeBinding: string = DEFAULT_SCOPE_BINDING

	readonly fnBinding: string
	readonly scopeBinding: string
	private readonly __list: List<FnNode<T>>
	private __nodeMap: { [key: string]: FnNode<T> }

	constructor(fnBinding?: string, scopeBinding?: string) {
		this.__nodeMap = create(null)
		this.__list = new List()
		this.fnBinding = fnBinding || DEFAULT_FN_BINDING
		this.scopeBinding = scopeBinding || DEFAULT_SCOPE_BINDING
	}
	/**
	 * add executable function
	 * @param fn		function
	 * @param scope		scope of function
	 * @param data		user data of [function + scope]
	 * @return executable function id, can remove executable function by id: {@link FnList#removeId}
	 */
	add(fn: T, scope?: any, data?: any): string {
		scope = parseScope(scope)
		const { __list: list, __nodeMap: nodeMap } = this
		const id = this.id(fn, scope)
		let node = nodeMap[id]
		if (!node) {
			node = [id, fn, scope, data]
			if (list.add(node)) nodeMap[id] = node
			return id
		}
	}

	/**
	 * remove executable function by id
	 *
	 * @param id
	 */
	removeId(id: string): number {
		const { __list: list, __nodeMap: nodeMap } = this
		const node = nodeMap[id]
		if (node) {
			nodeMap[id] = undefined
			return list.remove(node)
		}
		return -1
	}
	remove(fn: T, scope?: any): number {
		return this.removeId(this.id(fn, parseScope(scope)))
	}
	has(fn: T, scope?: any): string {
		const id = this.id(fn, parseScope(scope))
		return this.__nodeMap[id] && id
	}
	hasId(id: string): boolean {
		return !!this.__nodeMap[id]
	}
	size(): number {
		return this.__list.size()
	}
	clean() {
		this.__nodeMap = create(null)
		this.__list.clean()
	}
	each(cb: (fn: T, scope: any, data: any, __node: FnNode<T>) => boolean | void, scope?: any) {
		cb = cb.bind(scope)
		this.__list.each(node => cb(node[1], node[2], node[3], node))
	}
	eachUnsafe(cb: (fn: T, scope: any, data: any, __node: FnNode<T>) => boolean | void, scope?: any) {
		this.__list.eachUnsafe(node => cb(node[1], node[2], node[3], node))
	}
	id(fn: T, scope?: any): string {
		const { fnBinding, scopeBinding } = this

		let fnId = fn[fnBinding],
			scopeId = scope ? scope[scopeBinding] : DEFAULT_SCOPE_ID
		if (!fnId) fnId = defValue(fn, fnBinding, ++fnIdGenerator, false, false, false)
		if (!scopeId) scopeId = defValue(scope, scopeBinding, ++scopeIdGenerator, false, false, false)
		return `${fnId}#${scopeId}`
	}
}

const DEFAULT_SCOPE_ID = 1
let scopeIdGenerator = 1,
	fnIdGenerator = 0

function parseScope(scope: any): any {
	return !scope ? undefined : scope
}
