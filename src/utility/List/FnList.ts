/**
 * Function List
 * @module utility/List
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Mon Dec 10 2018 18:48:02 GMT+0800 (China Standard Time)
 */

import { List } from './List'
import { create } from '../create'
import { defPropValue } from '../prop'

const DEFAULT_FN_BINDING = '__id__'
const DEFAULT_SCOPE_BINDING = '__id__'

type FnNode<T extends Function> = [string, T, any, any]
export class FnList<T extends Function> {
	static readonly fnBinding: string = DEFAULT_FN_BINDING
	static readonly scopeBinding: string = DEFAULT_SCOPE_BINDING

	readonly fnBinding: string
	readonly scopeBinding: string
	private readonly list: List<FnNode<T>>
	private nodeMap: { [key: string]: FnNode<T> }

	constructor(fnBinding?: string, scopeBinding?: string) {
		this.nodeMap = create(null)
		this.list = new List()
		this.fnBinding = fnBinding || DEFAULT_FN_BINDING
		this.scopeBinding = scopeBinding || DEFAULT_SCOPE_BINDING
	}
	add(fn: T, scope?: any, data?: any): number {
		scope = parseScope(scope)
		const { list, nodeMap } = this
		const id = nodeId(this, fn, scope)
		let node = nodeMap[id]
		if (!node) {
			node = [id, fn, scope, data]
			var ret = list.add(node)
			if (ret) nodeMap[id] = node
			return ret
		}
		return -1
	}
	remove(fn: T, scope?: any): number {
		const { list, nodeMap } = this
		const id = nodeId(this, fn, parseScope(scope))
		const node = nodeMap[id]
		if (node) {
			nodeMap[id] = undefined
			return list.remove(node)
		}
		return -1
	}
	has(fn: T, scope?: any): boolean {
		return !!this.nodeMap[nodeId(this, fn, parseScope(scope))]
	}
	size(): number {
		return this.list.size()
	}
	clean() {
		this.nodeMap = create(null)
		this.list.clean()
	}
	each(cb: (fn: T, scope: any, data: any) => boolean | void, scope?: any) {
		cb = cb.bind(scope)
		this.list.each(node => cb(node[1], node[2], node[3]))
	}
	toJSON(){}
}

const DEFAULT_SCOPE_ID = 1
let scopeIdGenerator = 1,
	fnIdGenerator = 0

function nodeId<T extends Function>(list: FnList<T>, fn: T, scope?: any): string {
	const { fnBinding, scopeBinding } = list

	let fnId = fn[fnBinding],
		scopeId = scope ? scope[scopeBinding] : DEFAULT_SCOPE_ID
	if (!fnId) fnId = defPropValue(fn, fnBinding, ++fnIdGenerator, false, false, false)
	if (!scopeId) scopeId = defPropValue(scope, scopeBinding, ++scopeIdGenerator, false, false, false)
	return `${fnId}&${scopeId}`
}

function parseScope(scope: any): any {
	return !scope ? undefined : scope
}
