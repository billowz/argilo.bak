/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-20 17:59:58
 * @Last Modified by:   tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-20 17:59:58
 */
import { assert } from 'devlevel'
import FnList from './FnList'

const ticks = new FnList()
let pending = false
let next

function executeTick(fn, scope) {
	scope ? fn.call(scope) : fn()
}

function flush() {
	ticks.each(executeTick)
	ticks.clean()
	pending = false
}

if (typeof MutationObserver === 'function') {
	// chrome18+, safari6+, firefox14+,ie11+,opera15
	var counter = 0,
		observer = new MutationObserver(flush),
		textNode = document.createTextNode(counter)
	observer.observe(textNode, {
		characterData: true,
	})
	next = function() {
		textNode.data = counter = counter ? 0 : 1
	}
} else {
	next = function() {
		setTimeout(flush, 0)
	}
}

export function nextTick(fn, scope) {
	ticks.add(fn, scope)
	if (!pending) {
		pending = true
		next()
	}
}

export function clearTick(fn, scope) {
	ticks.remove(fn, scope)
}
