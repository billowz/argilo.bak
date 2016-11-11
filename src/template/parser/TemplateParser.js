import TextParser from './TextParser'
import DirectiveParser from './DirectiveParser'
import Compontent from '../Compontent'
import {
  Directive,
  DirectiveGroup,
  Text
} from '../binding'
import dom from '../../dom'
import logger from '../log'
import configuration from '../configuration'
import {
  dynamicClass,
  each,
  map,
  assign,
  assignIf,
  trim,
  isString,
  isFunc,
  isExtendOf,
  isArrayLike
} from 'ilos'

let directiveParser = new DirectiveParser(/^ag-/),
  textParser = new TextParser('${', '}')

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

function _clone(el) {
  let elem = el.cloneNode(false)
  if (el.nodeType == 1)
    each(el.childNodes, c => {
      elem.appendChild(_clone(c))
    })
  return elem
}

function clone(el) {
  return isArrayLike(el) ? map(el, _clone) : _clone(el)
}

function insertText(content, before) {
  let el = document.createTextNode(content)
  dom.before(el, before)
  return el
}

function insertNotBlankText(content, before) {
  return (content) ? insertText(content || '&nbsp;', before) : undefined
}

function _eachDom(el, data, elemHandler, textHandler) {
  switch (el.nodeType) {
    case 1:
      if (data = elemHandler(el, data))
        each(map(el.childNodes, (n) => n), (el) => {
          _eachDom(el, data, elemHandler, textHandler)
        })
      break
    case 3:
      textHandler(el, data)
      break
  }
}

function eachDom(el, data, elemHandler, textHandler) {
  if (isArrayLike(el)) {
    each(el, (el) => {
      _eachDom(el, data, elemHandler, textHandler)
    })
  } else {
    _eachDom(el, data, elemHandler, textHandler)
  }
  return data
}

function parseTemplateEl(el) {
  if (isString(el)) {
    el = trim(el)
    if (el.charAt(0) == '<' || el.length > 30) {
      let templ = document.createElement('div')
      dom.html(templ, el)
      el = templ.childNodes
    }
    el = dom.query(el)
  } else if (clone) {
    el = dom.cloneNode(el)
  }
  return el
}

function getTextParser(markEl, textParser) {
  return (el, bindings) => {
    let expr = dom.text(el),
      tokens = textParser.tokens(expr),
      pos = 0
    each(tokens, token => {
      if (pos < token.start)
        markEl(insertNotBlankText(expr.slice(pos, token.start), el), false)
      bindings.push({
        constructor: Text,
        index: markEl.index,
        params: {
          expression: token.token
        }
      })
      markEl(insertText('binding', el), false)
      pos = token.end
    })
    if (pos) {
      markEl(insertNotBlankText(expr.slice(pos), el), false)
      dom.remove(el)
    } else {
      markEl(el, false)
    }
  }
}

function getDirectiveParser(markEl, directiveParser) {
  return (el, bindings) => {
    let directives = [],
      block = false,
      independent = false,
      binding

    each(el.attributes, (attr) => {
      let name = attr.name,
        directive,
        binding

      if (!directiveParser.isDirective(name))
        return

      if (!(directive = directiveParser.getDirective(name))) {
        logger.warn(`Directive[${name}] is undefined`)
        return
      }

      binding = {
        constructor: directive,
        index: markEl.index,
        params: {
          expression: attr.value,
          attr: name
        }
      }
      if (Directive.isIndependent(directive)) {
        var childEl = dom.cloneNode(el, false)
        dom.removeAttr(childEl, directives[0].attr)
        dom.append(childEl, map(el.childNodes, (n) => n))
        binding.params.templateParser = new TemplateParser(childEl, false)
        independent = block = true
        directives = [binding]
        return false
      } else if (Directive.isBlock(directive)) {
        block = true
      }
      directives.push(binding)
    })

    if (!directives.length) {
      markEl(el, true)
      return bindings
    }
    binding = {
      constructor: DirectiveGroup,
      index: index,
      directives: directives.sort((a, b) => {
        return (Directive.getPriority(b.directive) - Directive.getPriority(a.directive)) || 0
      }),
      children: !block && []
    }
    bindings.push(binding)
    markEl(el, !block)
    return binding.children
  }
}

function parse(el, directiveParser, textParser) {
  let elStatus = []

  function markEl(el, marked) {
    if (el) {
      elStatus.push({
        el: el,
        marked: marked
      })
      markEl.index++
    }
    return el
  }
  markEl.index = 0
  return {
    bindings: eachDom(el, [], getDirectiveParser(markEl, directiveParser), getTextParser(markEl, textParser)),
    elStatus: elStatus
  }
}

function cloneTemplateEl(el, elStatus) {
  let index = 0,
    cloneEl = clone(el)
  return {
    el: cloneEl,
    list: eachDom(cloneEl, [], (el, els) => {
      els.push(el)
      return elStatus[index++].marked && els
    }, (el, els) => {
      els.push(el)
      index++
    })
  }
}

const TemplateParser = dynamicClass({
  constructor(el, cfg = {}) {
    this.el = parseTemplateEl(el, cfg.clone)
    this.directiveParser = cfg.directiveParser || directiveParser
    this.textParser = cfg.textParser || textParser
    assign(this, parse(this.el, this.directiveParser, this.textParser))
  },
  complie(context) {
    let templ = cloneTemplateEl(this.el, this.elStatus),
      elList = templ.list

    if (!context.scope)
      context.scope = {}
    if (!context.props)
      context.props = {}

    function create(bindings) {
      return map(bindings, binding => {
        let directives = binding.directives,
          children = binding.children
        return new binding.constructor(assign({
          el: elList[binding.index],
          context: context,
          directives: directives && map(directives, directive => {
            return new directive.constructor(directive.params)
          }),
          children: children && create(children)
        }, binding.params || {}))
      })
    }
    return new Compontent(templ.el, create(this.bindings), context)
  }
})
export default TemplateParser