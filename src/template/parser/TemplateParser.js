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

function isStringTemplate(str) {
  return str.charAt(0) == '<' || str.length > 30
}

function stringTemplate(str) {
  let templ = document.createElement('div')
  dom.html(templ, str)
  return map(templ.childNodes, el => el)
}

function parseTemplateEl(el, clone) {
  if (isString(el)) {
    el = trim(el)
    if (isStringTemplate(el))
      return stringTemplate(el)
    el = dom.query(el)
  }
  if (el) {
    if (el.tagName == 'SCRIPT') {
      el = stringTemplate(el.innerHTML)
    } else if (clone) {
      el = dom.cloneNode(el)
    }
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

function getDirectiveParser(markEl, directiveParser, textParser) {
  return (el, bindings) => {
    let directives = [],
      block = false,
      independent = false,
      binding

    each(el.attributes, (attr) => {
      let name = attr.name,
        directive,
        binding,
        params,
        paramMap,
        _block = true

      if (!directiveParser.isDirective(name))
        return

      if (!(directive = directiveParser.getDirective(name))) {
        logger.warn(`Directive[${name}] is undefined`)
        return
      }
      params = Directive.getParams(directive)
      binding = {
        constructor: directive,
        index: markEl.index,
        params: {
          expression: attr.value,
          attr: name,
          params: isArray(params) && reverseConvert(params, name => {
            return el.getAttribute(name)
          })
        }
      }

      switch (Directive.getType(directive)) {
        case 'template':
          {
            var templ = dom.cloneNode(el, false)
            dom.removeAttr(templ, name)
            dom.append(templ, map(el.childNodes, (n) => n))
            binding.params.templateParser = new TemplateParser(templ, {
              directiveParser,
              textParser,
              clone: false
            })
          }
          break
        case 'inline-template':
          binding.params.templateParser = new TemplateParser(map(el.childNodes, (n) => n), {
            directiveParser,
            textParser,
            clone: false
          })
          dom.html(el, '')
          break
        case 'block':
          break
        case 'empty-block':
          dom.html(el, '')
          break
        default:
          _block = false
          break
      }
      if (_block)
        block = _block
      if (Directive.isAlone(directive)) {
        directives = [binding]
        return false
      }
      directives.push(binding)
    })

    if (!directives.length) {
      markEl(el, true)
      return bindings
    }
    binding = {
      constructor: DirectiveGroup,
      index: markEl.index,
      directives: directives.sort((a, b) => {
        return (Directive.getPriority(b.constructor) - Directive.getPriority(a.constructor)) || 0
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
    bindings: eachDom(el, [], getDirectiveParser(markEl, directiveParser, textParser), getTextParser(markEl, textParser)),
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

const TemplateParser = createClass({
  constructor(el, cfg = {}) {
    this.el = parseTemplateEl(el, cfg.clone)
    if (!this.el)
      throw new Error(`Invalid Dom Template: ${el}`)
    this.directiveParser = cfg.directiveParser || directiveParser
    this.textParser = cfg.textParser || textParser
    assign(this, parse(this.el, this.directiveParser, this.textParser))
  },
  clone() {
    let templ = cloneTemplateEl(this.el, this.elStatus),
      el = templ.el,
      elList = templ.list

    function create(bindings) {
      return map(bindings, binding => {
        let directives = binding.directives,
          children = binding.children,
          el = elList[binding.index],
          desc = {
            constructor: binding.constructor,
            el: el,
            params: binding.params
          }
        if (directives)
          desc.directives = map(directives, directive => {
            return {
              constructor: directive.constructor,
              el: el,
              params: directive.params
            }
          })
        if (children)
          desc.children = create(children)
        return desc
      })
    }
    return {
      el: el,
      bindings: create(this.bindings)
    }
  }
})
export default TemplateParser
