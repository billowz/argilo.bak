
/**
 * @module polyfill
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:26:47 GMT+0800 (China Standard Time)
 */

const QUERY_SELECTOR = 'querySelector',
	QUERY_SELECTOR_ALL = QUERY_SELECTOR + 'All',
	QUERY_RESULTS = '__queryResults'

if (!document[QUERY_SELECTOR_ALL]) {
	document[QUERY_RESULTS] = []
	document[QUERY_SELECTOR_ALL] = function(selector) {
		const head = document.documentElement.firstChild,
			styleTag = document.createElement('STYLE')

		head.appendChild(styleTag)
		if (styleTag.styleSheet) {
			// for IE
			styleTag.styleSheet.cssText = selector + `{x:expression(document[${QUERY_RESULTS}].push(this))}`
		} else {
			// others
			let textnode = document.createTextNode(selector + `{x:expression(document[QUERY_RESULTS].push(this))}`)
			styleTag.appendChild(textnode)
		}
		window.scrollBy(0, 0)
		const ret = document[QUERY_RESULTS]
		document[QUERY_RESULTS] = []
		return ret
	}
}
if (!document[QUERY_SELECTOR]) {
	document[QUERY_SELECTOR] = function(selectors) {
		const elements = document[QUERY_SELECTOR_ALL](selectors)
		return elements.length ? elements[0] : null
	}
}
