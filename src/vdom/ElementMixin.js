/*
 *
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-25 17:47:25
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-09-01 11:29:48
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
	},
}
