/**
 * @module vdom
 * @author Tao Zeng <tao.zeng.zt@qq.com>
 * @created Tue Nov 06 2018 10:06:22 GMT+0800 (China Standard Time)
 * @modified Sat Nov 17 2018 09:28:12 GMT+0800 (China Standard Time)
 */
import { assert } from 'devlevel'
import { inDoc, CREATE_ELEMENT, APPEND_CHILD, INNER_HTML } from './util/util'

const DOM_ELEMENT = '__element__'
const CHECKED = 'checked'

const OUTER_HTML = 'outerHTML'

export default {
	$htmlElement: true,
	init(option) {
		const el = document[CREATE_ELEMENT](this.tagName)
		el[DOM_ELEMENT] = this
		this.el = el
		this.initDomEvent()
	},
	inDoc() {
		return inDoc(this.el)
	},
	outerHtml() {
		const el = this.el
		if (el[OUTER_HTML]) return el[OUTER_HTML]
		DIV[APPEND_CHILD](el.cloneNode(true))
		const html = DIV[INNER_HTML]
		DIV[INNER_HTML] = ''
		return html
	},
	focus() {
		this.el.focus()
		return this
	}
}
