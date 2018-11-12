/*
 *
 * Void elements:
 *      area, base, br, col, embed, hr, img, input, link, meta, param, source, track, wbr
 *
 * The template elements
 *      template
 *
 * Raw text elements
 *      script, style
 *
 * escapable raw text elements
 *      textarea, title
 *
 * Normal elements
 *      All other allowed HTML elements are normal elements.
 *
 *      Main root:               html
 *      Document metadata:       link, meta, style, title
 *      Sectioning root:         body
 *      Content sectioning:      address, article, aside, footer, header, h1, h2, h3, h4, h5, h6, hgroup, nav, section
 *      Text content:            blockquote, dd, dir, div, dl, dt, figcaption, figure, hr, li, main, ol, p, pre, ul
 *      Inline text semantics:   a, abbr, b, bdi, bdo, br, cite, code, data, dfn, em, i, kbd, mark, nobr, q, rp,
 *                               rt, rtc, ruby, s, samp, small, span, strong, sub, sup, time, tt, u, var, wbr
 *      Image and multimedia:    area, audio, img, map, track, video
 *      Embedded content:        applet, embed, iframe, noembed, object, param, picture, source
 *      Scripting:               canvas, noscript, script
 *      Demarcating edits:       del, ins
 *      Table content:           caption, col, colgroup, table, tbody, td, tfoot, th, thead, tr
 *      Forms:                   button, datalist, fieldset, form, input, label, legend, meter,
 *                               optgroup, option, output, progress, select, textarea
 *      Interactive elements:    details, dialog, menu, menuitem, summary
 *      Web Components:          content, element, shadow, slot, template
 *
 *      Obsolete and deprecated elements:
 *           acronym, applet, basefont, bgsound, big, blink, center, command, content, dir, element,
 *           font, frame, frameset, image, isindex, keygen, listing, marquee, menuitem, multicol, nextid,
 *           nobr, noembed, noframes, plaintext, shadow, spacer, strike, tt, xmp
 *
 * Foreign elements
 *      Elements from the MathML namespace and the SVG namespace.
 *
 *      SVG:
 *          https://developer.mozilla.org/en-US/docs/Web/SVG/Element
 *
 *      MathML:
 *          https://developer.mozilla.org/en-US/docs/Web/MathML/Element
 *
 * links:
 *      https://www.w3.org/TR/html5/syntax.html#writing-html-documents
 *      https://developer.mozilla.org/my/docs/Web/HTML/Element
 *
 * @author tao.zeng (tao.zeng.zt@gmail.com)
 * @created 2018-08-25 18:55:34
 * @Last Modified by: tao.zeng (tao.zeng.zt@gmail.com)
 * @Last Modified time: 2018-08-27 14:29:35
 */
import { registerVElement } from '../vnode'
import Element from './Element'
import ComplexElement from './ComplexElement'
import { inherit, createClass } from '../helper'

register(Element, 'area,br,col,embed,hr,img,input,param,source,track,wbr')

register(
	ComplexElement,
	'address,article,aside,footer,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
		'blockquote,dd,dir,div,dl,dt,figcaption,figure,li,main,ol,p,pre,ul,a,abbr,b,bdi,bdo,cite,code,data,dfn,em,i,kbd,' +
		'mark,nobr,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,tt,u,var,audio,map,video,applet,iframe,' +
		'noembed,object,picture,canvas,noscript,del,ins,caption,colgroup,table,tbody,td,tfoot,th,thead,tr,' +
		'button,datalist,fieldset,form,label,legend,meter,optgroup,option,output,progress,select,details,' +
		'dialog,menu,menuitem,summary,content,element,shadow,slot'
)

register(ComplexElement, 'template')
register(ComplexElement, 'textarea')
register(ComplexElement, 'script')
register(ComplexElement, 'style')
register(ComplexElement, 'link,meta,base')
register(ComplexElement, 'title')

function register(Element, tags) {
	tags = tags.split(',')
	for (let i = 0, l = tags.length; i < l; i++) {
		registerVElement(
			tags[i],
			createClass({
				extend: Element,
				name: Element.name,
				tagName: tags[i],
			})
		)
	}
}
