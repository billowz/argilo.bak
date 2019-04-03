/**
 * String format
 * @module utility/nextTick
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Wed Apr 03 2019 19:45:47 GMT+0800 (China Standard Time)
 */
import { FnList } from './List'
import { TYPE_FN } from './consts'

let next: () => void
if (typeof MutationObserver === TYPE_FN) {
	// chrome18+, safari6+, firefox14+,ie11+,opera15
	const textNode = document.createTextNode(v)

	new MutationObserver(flush).observe(textNode, {
		characterData: true
	})
	var v = ''
	next = function() {
		textNode.data = v = v ? '0' : ''
	}
} else {
	next = function() {
		setTimeout(flush, 0)
	}
}

const ticks = [new FnList<() => void>(), new FnList<() => void>()]
let pending: FnList<() => void>,
	i = 0

function executeTick(fn: () => void, scope?: any) {
	scope ? fn.call(scope) : fn()
}

function flush() {
	const t = pending
	pending = null
	t.each(executeTick)
	t.clean()
}

export function nextTick(fn: () => void, scope?: any): string {
	if (!pending) {
		pending = ticks[++i & 1]
		next()
	}
	return pending.add(fn, scope)
}

export function clearTick(fn: () => void, scope?: any) {
	return pending.remove(fn, scope)
}

export function clearTickId(id: string) {
	return pending.removeId(id)
}
