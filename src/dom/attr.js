import dom from './core'
import _ from 'ilos'

const rfocusable = /^(?:input|select|textarea|button|object)$/i,
  rclickable = /^(?:a|area)$/i

export default _.assign(dom, {
  prop(el, name, value) {
    name = dom.propFix[name] || name
    let hook = dom.propHooks[name]

    if (arguments.length == 2)
      return hook && hook.get ? hook.get(el, name) : el[name]
    hook && hook.set ? hook.set(el, name, value) : (el[name] = value)
    return dom
  },
  attr(el, name, val) {
    if (arguments.length == 2)
      return el.getAttribute(name)
    el.setAttribute(name, val)
    return dom
  },
  removeAttr(el, name) {
    el.removeAttribute(name)
    return dom
  },
  checked(el, check) {
    return _prop(el, 'checked', arguments.length > 1, check)
  },
  class(el, cls) {
    return _prop(el, 'class', arguments.length > 1, cls)
  },
  addClass(el, cls) {
    if (el.classList) {
      el.classList.add(cls)
    } else {
      let cur = ` ${dom.prop(el, 'class')} `
      if (cur.indexOf(` ${cls} `) === -1)
        dom.class(el, _.trim(cur + cls))
    }
    return dom
  },
  removeClass(el, cls) {
    el.classList ? el.classList.remove(cls) :
      dom.class(el, _.trim(` ${dom.prop(el, 'class')} `.replace(new RegExp(` ${cls} `, 'g'), '')))
    return dom
  },
  style(el, style) {
    return _prop(el, 'style', arguments.length > 1, style)
  },
  propHooks: {
    tabIndex: {
      get: function(elem) {
        let attributeNode = elem.getAttributeNode('tabindex')

        return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) :
          rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
          0 : undefined
      }
    }
  },
  propFix: {
    tabindex: 'tabIndex',
    readonly: 'readOnly',
    'for': 'htmlFor',
    'class': 'className',
    maxlength: 'maxLength',
    cellspacing: 'cellSpacing',
    cellpadding: 'cellPadding',
    rowspan: 'rowSpan',
    colspan: 'colSpan',
    usemap: 'useMap',
    frameborder: 'frameBorder',
    contenteditable: 'contentEditable'
  }
})

function _prop(el, name, set, val) {
  if (!set) return dom.prop(el, name)
  dom.prop(el, name, val)
  return dom
}
