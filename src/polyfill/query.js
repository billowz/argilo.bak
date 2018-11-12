/*
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-29 12:35:31
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-01 11:07:38
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
