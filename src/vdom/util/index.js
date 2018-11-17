/**
 * @module vdom
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:30:17 GMT+0800 (China Standard Time)
 */
import { ROOTELEMENT, ADD_EVENT_LISTENER, ATTACH_EVENT } from './util'
import { nextTick } from '../../common'

export const W3C = !!window.dispatchEvent
export const IE8 = !!window.XDomainRequest
export const IE9 = navigator.userAgent.indexOf('MSIE 9') !== -1

export default function ready(fn) {
	!isReady ? readyList.push(fn) : fn()
}

let readyList = [],
	isReady

function fireReady(fn) {
	isReady = true
	while ((fn = readyList.shift())) fn()
	readyList = undefined
}

const READY_STATE = 'readyState',
	DO_SCROLL = 'doScroll'

if (document[READY_STATE] === 'complete') {
	nextTick(fireReady)
} else if (document[ADD_EVENT_LISTENER]) {
	document[ADD_EVENT_LISTENER]('DOMContentLoaded', fireReady)
} else if (document[ATTACH_EVENT]) {
	document[ATTACH_EVENT]('onreadystatechange', function() {
		if (document[READY_STATE] === 'complete') fireReady()
	})
	if (ROOTELEMENT[DO_SCROLL] && window.frameElement === null && window.external) {
		function doScrollCheck() {
			try {
				ROOTELEMENT[DO_SCROLL]('left')
				fireReady()
			} catch (e) {
				nextTick(doScrollCheck)
			}
		}
		doScrollCheck()
	}
}
