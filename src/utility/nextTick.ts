/**
 * String format
 * @module utility/nextTick
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Thu Jan 31 2019 16:34:55 GMT+0800 (China Standard Time)
 */
import { FnList } from './List'
import { TYPE_FN } from './consts'

const ticks = new FnList()
let pending = false
let next: () => void

function executeTick(fn: Function, scope?: any) {
	scope ? fn.call(scope) : fn()
}

function flush() {
	ticks.each(executeTick)
	ticks.clean()
	pending = false
}

if (typeof MutationObserver === TYPE_FN) {
	// chrome18+, safari6+, firefox14+,ie11+,opera15
	var counter = 0,
		observer = new MutationObserver(flush),
		textNode = document.createTextNode(counter + '')
	observer.observe(textNode, {
		characterData: true
	})
	next = function() {
		textNode.data = counter + ''
		counter = counter ? 0 : 1
	}
} else {
	next = function() {
		setTimeout(flush, 0)
	}
}

export function nextTick(fn: Function, scope?: any) {
	ticks.add(fn, scope)
	if (!pending) {
		pending = true
		next()
	}
}

export function clearTick(fn: Function, scope?: any) {
	ticks.remove(fn, scope)
}
