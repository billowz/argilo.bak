import TextParser from './TextParser'
import DirectiveParser from './DirectiveParser'
import {
  Directive,
  DirectiveGroup,
  Text
} from '../binding'
import dom from '../../dom'
import logger from '../log'
import configuration from '../configuration'
import {
  createClass,
  each,
  eachArray,
  map,
  assign,
  assignIf,
  trim,
  isString,
  isFunc,
  isExtendOf,
  isArrayLike,
  isArray,
  reverseConvert
} from 'ilos'


let directiveParser = new DirectiveParser(/^ag-/),
  textParser = new TextParser('{', '}')

configuration.register('directiveParser', directiveParser, 'init', (parser) => {
  if (!(parser instanceof DirectiveParser))
    throw new Error('Invalid Directive Parser: ' + parser)
  directiveParser = parser
  return true
})

configuration.register('textParser', textParser, 'init', (parser) => {
  if (!(parser instanceof TextParser))
    throw new Error('Invalid Text Parser: ' + parser)
  textParser = parser
  return true
})

function _eachDom(el, data, elemHandler, textHandler, readonly) {
  switch (el.nodeType) {
    case Document.ELEMENT_NODE:
      if (data = elemHandler(el, data)) {
        var children = el.childNodes
        eachArray(readonly ? children : map(children, (n) => n), (el) => {
          _eachDom(el, data, elemHandler, textHandler)
        })
      }
      break
    case Document.TEXT_NODE:
      textHandler(el, data)
      break
  }
}

function eachDom(el, data, elemHandler, textHandler, readonly) {
  if (isArrayLike(el)) {
    eachArray(el, (el) => {
      _eachDom(el, data, elemHandler, textHandler, readonly)
    })
  } else {
    _eachDom(el, data, elemHandler, textHandler, readonly)
  }
  return data
}

function isStringTemplate(str) {
  return str.charAt(0) == '<' || str.length > 30
}

function stringTemplate(str) {
  let templ = document.createElement('div')
  dom.html(templ, str)
  return map(templ.childNodes, el => el)
}

function parseTemplateEl(el) {
  if (isString(el)) {
    el = trim(el)
    if (isStringTemplate(el))
      return stringTemplate(el)
    el = dom.query(el)
  }
  if (el) {
    if (el.tagName == 'SCRIPT') {
      el = stringTemplate(el.innerHTML)
    }
  }
  return el
}


const Comment = createClass({
  type: Document.COMMENT_NODE,
  constructor(comment) {
    this.comment = comment
  },
  el() {

  }
})

const TextNode = createClass({
  type: Document.TEXT_NODE,
  constructor(text, expr) {
    this.text = text
    this.expr = expr
  },
  el(pel, params) {
    var expr = this.expr,
      el = document.createTextNode(this.text)
    pel.appendChild(el)
    if (expr)
      return [new Text(assign({
        expression: expr,
        el
      }, params))]
  }
})

const Element = createClass({
  type: Document.ELEMENT_NODE,
  constructor(nodeName, attrs, children, directives) {
    this.nodeName = nodeName
    this.attrs = attrs
    if (isString(children)) {
      this.html = children
    } else {
      this.children = children || undefined
    }
    this.directives = directives
  },
  el(pel, params) {
    let directives = this.directives,
      children = this.children,
      cbindings = [],
      el = document.createElement(this.nodeName)

    eachArray(this.attrs, attr => {
      dom.attr(el, attr.name, attr.value)
    })

    pel.appendChild(el)


    if (children && children.length) {
      eachArray(children, c => {
        let cbs = c.el(el, params)
        if (cbs)
          cbindings = cbindings.concat(cbs)
      })
    }
    if (directives && directives.length) {
      directives = map(directives, d => {
        return {
          constructor: d.Class,
          params: {
            expression: d.expression,
            attr: d.attr,
            templateParser: d.templateParser
          }
        }
      })
      return new DirectiveGroup(assign({
        el,
        directives: directives,
        children: cbindings
      }, params))
    }
    return cbindings
  }
})

function addText(coll, text, expression) {
  text = trim(text)
  if (text || expression) {
    coll.push(new TextNode(text, expression))
  }
}

function readAttrs(el, directiveParser) {
  let attrs = [],
    directives = []
  eachArray(el.attributes, (attr) => {
    var {
      name,
      value
    } = attr,
    directive
    if (!directiveParser.isDirective(name)) {
      attrs.push({
        name,
        value
      })
    } else if (directive = directiveParser.getDirective(name)) {
      directives.push({
        Class: directive,
        expression: value,
        attr: name
      })
    } else {
      logger.warn(`Directive[${name}] is undefined`)
    }
  })
  directives = directives.sort((a, b) => {
    return (Directive.getPriority(b.Class) - Directive.getPriority(a.Class)) || 0
  })
  return {
    attrs,
    directives
  }
}

function createElement(el, attrs, directives) {
  let hasEmptyBlock = false,
    html = undefined

  eachArray(directives, directive => {
    let Class = directive.Class,
      emptyBlock = false,
      htmlBlock = false

    switch (Directive.getType(Class)) {
      case 'template':
        dom.removeAttr(el, directive.attr)
        dom.append(el, map(el.childNodes, (n) => n))
        directive.templateParser = new TemplateParser(el, {
          directiveParser,
          textParser
        })
        emptyBlock = true
        break
      case 'inline-template':
        directive.templateParser = new TemplateParser(map(el.childNodes, (n) => n), {
          directiveParser,
          textParser
        })
        emptyBlock = true
        break
      case 'block':
        htmlBlock = dom.html(el)
        break
      case 'empty-block':
        emptyBlock = true
        break
    }

    if (Directive.isAlone(Class)) {
      directives = [directive]
      hasEmptyBlock = emptyBlock
      html = htmlBlock
      return false
    }
    if (emptyBlock)
      hasEmptyBlock = true
    if (htmlBlock)
      html = htmlBlock
  })
  return new Element(el.nodeName, attrs, !hasEmptyBlock && (html || []), directives)
}

const TemplateParser = createClass({
  constructor(el, cfg = {}) {
    this.el = parseTemplateEl(el)
    if (!this.el)
      throw new Error(`Invalid Dom Template: ${el}`)
    this.directiveParser = cfg.directiveParser || directiveParser
    this.textParser = cfg.textParser || textParser

    this.dom = eachDom(this.el, [], (el, coll) => {
      let {
        attrs,
        directives
      } = readAttrs(el, this.directiveParser),
        elem = createElement(el, attrs, directives)
      coll.push(elem)
      return elem.children
    }, (el, coll) => {
      let expr = dom.text(el),
        tokens = this.textParser.tokens(expr)

      if (tokens.length) {
        var pos = 0
        eachArray(tokens, token => {
          if (pos < token.start)
            addText(coll, expr.slice(pos, token.start))
          addText(coll, 'binding', token.token)
          pos = token.end
        })
        addText(coll, expr.slice(pos))
      } else {
        addText(coll, expr)
      }
    })
  },
  clone(params) {
    let frame = document.createDocumentFragment(),
      bindings = []

    eachArray(this.dom, node => {
      let cbs = node.el(frame, params)
      if (cbs)
        bindings = bindings.concat(cbs)
    })
    return {
      el: map(frame.childNodes, n => n),
      bindings
    }
  }
})

export default TemplateParser
