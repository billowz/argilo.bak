import {
  each,
  eachArray,
  map,
  isString,
  isArrayLike
} from 'ilos'

const textContent = typeof document.createElement('div').textContent == 'string' ? 'textContent' : 'innerText'

function firstEl(el) {
  return isArrayLike(el) ? el[0] : el
}


function lastEl(el) {
  return isArrayLike(el) ? el[el.length - 1] : el
}

function apply(coll, callback) {
  isArrayLike(coll) ? eachArray(coll, callback) : callback(coll)
}

let dom = {
  W3C: !!window.dispatchEvent,
  inDoc(el, root) {
    root = root || document.documentElement
    if (root.contains)
      return root.contains(el)
    try {
      while ((el = el.parentNode)) {
        if (el === root)
          return true
      }
    } catch (e) {}
    return false
  },
  query(selectors, all) {
    if (isString(selectors))
      return all ? document.querySelectorAll(selectors) : document.querySelector(selectors)
    return selectors
  },
  cloneNode(el, deep) {
    function clone(el) {
      return el.cloneNode(deep !== false)
    }
    return isArrayLike(el) ? map(el, clone) : clone(el)
  },
  parent(el) {
    return firstEl(el).parentNode
  },
  next(el, all) {
    el = lastEl(el)
    return all ? el.nextSibling : el.nextElementSibling
  },
  prev(el, all) {
    el = firstEl(el)
    return all ? el.previousSibling : el.previousElementSibling
  },
  children(el, all) {
    el = firstEl(el)
    return all ? el.childNodes : el.children
  },
  remove(el) {
    apply(el, (el) => {
      let parent = el.parentNode
      if (parent)
        parent.removeChild(el)
    })
    return dom
  },
  before(el, target) {
    target = firstEl(target)
    let parent = target.parentNode
    apply(el, (el) => {
      parent.insertBefore(el, target)
    })
    return dom
  },
  after(el, target) {
    target = lastEl(target)
    let parent = target.parentNode

    apply(el, parent.lastChild === target ? (el) => {
      parent.appendChild(el)
    } : (() => {
      let next = target.nextSibling
      return (el) => {
        parent.insertBefore(el, next)
      }
    })())
    return dom
  },
  append(target, el) {
    target = firstEl(target)
    apply(el, (el) => {
      target.appendChild(el)
    })
    return dom
  },
  prepend(target, el) {
    target.firstChild ? dom.before(el, el.firstChild) : dom.append(target, el)
    return dom
  },
  replace(source, target) {
    let parent = source.parentNode
    parent.replaceChild(target, source)
  },
  html(el, html) {
    return arguments.length > 1 ? (el.innerHTML = html) : el.innerHTML
  },
  outerHtml(el) {
    if (el.outerHTML)
      return el.outerHTML

    let container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  },
  text(el, text) {
    if (el.nodeType == 3)
      return arguments.length > 1 ? (el.data = text) : el.data
    return arguments.length > 1 ? (el[textContent] = text) : el[textContent]
  },
  focus(el) {
    el.focus()
    return dom
  }
}

export default dom

//====================== Query =============================
if (!document.querySelectorAll) {
  document.querySelectorAll = function querySelectorAll(selector) {
    let doc = document,
      head = doc.documentElement.firstChild,
      styleTag = doc.createElement('STYLE')

    head.appendChild(styleTag)
    doc.__qsaels = []
    if (styleTag.styleSheet) { // for IE
      styleTag.styleSheet.cssText = selector + '{x:expression(document.__qsaels.push(this))}'
    } else { // others
      let textnode = document.createTextNode(selector + '{x:expression(document.__qsaels.push(this))}')
      styleTag.appendChild(textnode)
    }
    window.scrollBy(0, 0)
    return doc.__qsaels
  }
}
if (!document.querySelector) {
  document.querySelector = function querySelector(selectors) {
    let elements = document.querySelectorAll(selectors)
    return elements.length ? elements[0] : null
  }
}
