/**
 * String format
 * @module utility/nextTick
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Mon Dec 11 2017 14:35:32 GMT+0800 (China Standard Time)
 * @modified Mon Dec 10 2018 16:59:56 GMT+0800 (China Standard Time)
 */
import { FnList } from './List'
import { isFn } from './is'

const ticks = new FnList()
let pending = false
let next

function executeTick(fn: Function, scope?: any) {
	scope ? fn.call(scope) : fn()
}

function flush() {
	ticks.each(executeTick)
	ticks.clean()
	pending = false
}

if (isFn(MutationObserver)) {
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
