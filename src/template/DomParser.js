import TextParser from './TextParser'
import DirectiveParser from './DirectiveParser'
import Template from './Template'
import {
  Directive,
  DirectiveGroup,
  Text
} from '../binding'
import _ from 'ilos'
import dom from '../dom'
import logger from '../log'
import configuration from '../configuration'

configuration.register('directiveParser', new DirectiveParser(), 'init', (parser) => {
  if (!(parser instanceof DirectiveParser))
    throw new Error('Invalid Directive Parser: ' + parser)
  return true
})
configuration.register('TextParser', TextParser, 'init', (parser) => {
  if (parser !== TextParser && (!_.isFunc(parser) || !_.isExtendOf(parser, TextParser)))
    throw new Error('Invalid Text Parser: ' + parser)
  return true
})

const cfg = configuration.get()

function _clone(el) {
  let elem = el.cloneNode(false)
  if (el.nodeType == 1)
    _.each(el.childNodes, c => {
      elem.appendChild(_clone(c))
    })
  return elem
}

function clone(el) {
  return _.isArrayLike(el) ? _.map(el, _clone) : _clone(el)
}

const TEXT = 1,
  DIRECTIVE = 2,
  DIRECTIVE_GROUP = 3

const DomParser = _.dynamicClass({
  constructor(el, clone) {
    this.el = this.parseEl(el, clone)
    this.directiveParser = cfg.directiveParser
    this.TextParser = cfg.TextParser
    this.parse()
  },
  complie(scope) {
    let el = clone(this.el),
      df = document.createDocumentFragment(),
      tpl = new Template(scope)

    dom.append(df, el)

    tpl.el = el
    tpl.bindings = this.parseBindings(this.bindings, scope, this.parseEls(el), tpl)
    return tpl
  },
  parseBindings(descs, scope, els, tpl) {
    return _.map(descs, (desc) => {
      let type = desc.type,
        cfg = {
          el: els[desc.index],
          scope: scope,
          tpl: tpl
        }

      if (type === TEXT) {
        cfg.expression = desc.expression
        return new Text(cfg)
      }

      cfg.block = desc.block
      cfg.children = desc.children ? this.parseBindings(desc.children || [], scope, els) : undefined

      if (type === DIRECTIVE) {
        cfg.expression = desc.expression
        cfg.attr = desc.attr
        cfg.domParser = desc.domParser
        cfg.independent = desc.independent
        cfg.group = undefined
        return new desc.directive(cfg)
      } else {
        var group = new DirectiveGroup(cfg)
        group._setDirectives(_.map(desc.directives, desc => {
          return new desc.directive({
            el: cfg.el,
            scope: scope,
            expression: desc.expression,
            attr: desc.attr,
            tpl: tpl,
            group: group
          })
        }))
        return group
      }
    })
  },
  parseEls(el) {
    let index = 0,
      elStatus = this.elStatus
    return this.eachDom(el, [], (el, els) => {
      els.push(el)
      return elStatus[index++].marked && els
    }, (el, els) => {
      els.push(el)
      index++
    })
  },
  parseEl(el, clone) {
    if (_.isString(el)) {
      el = _.trim(el)
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
  },
  eachDom(el, data, elemHandler, textHandler) {
    if (_.isArrayLike(el)) {
      _.each(el, (el) => {
        this._eachDom(el, data, elemHandler, textHandler)
      })
    } else {
      this._eachDom(el, data, elemHandler, textHandler)
    }
    return data
  },
  _eachDom(el, data, elemHandler, textHandler) {
    switch (el.nodeType) {
      case 1:
        if (data = elemHandler(el, data))
          _.each(_.map(el.childNodes, (n) => n), (el) => {
            this._eachDom(el, data, elemHandler, textHandler)
          })
        break
      case 3:
        textHandler(el, data)
        break
    }
  },
  parse() {
    let elStatus = [],
      index = 0,
      TextParser = this.TextParser,
      directiveParser = this.directiveParser

    function markEl(el, marked) {
      if (el) {
        elStatus.push({
          el: el,
          marked: marked
        })
        index++
      }
      return el
    }
    this.elStatus = elStatus
    this.bindings = this.eachDom(this.el, [], (el, bindings) => {
      let directives = [],
        block = false,
        independent = false,
        desc

      _.each(el.attributes, (attr) => {
        let name = attr.name,
          directive

        if (!directiveParser.isDirective(name))
          return

        if (!(directive = directiveParser.getDirective(name))) {
          logger.warn(`Directive[${name}] is undefined`)
          return
        }
        let desc = {
          type: DIRECTIVE,
          index: index,
          expression: attr.value,
          directive: directive,
          attr: name,
          block: Directive.isBlock(directive),
          independent: Directive.isIndependent(directive)
        }
        if (desc.independent) {
          desc.block = block = independent = true
          directives = [desc]
          return false
        } else if (desc.block) {
          block = true
        }
        directives.push(desc)
      })

      if (!directives.length) {
        markEl(el, true)
        return bindings
      }

      if (directives.length == 1) {
        desc = directives[0]
      } else {
        desc = {
          type: DIRECTIVE_GROUP,
          index: index,
          directives: directives.sort((a, b) => {
            return (Directive.getPriority(b.directive) - Directive.getPriority(a.directive)) || 0
          }),
          block: block,
          independent: independent
        }
      }
      desc.children = !block && []

      bindings.push(desc)
      if (independent) {
        let childEl = dom.cloneNode(el, false)
        dom.removeAttr(childEl, directives[0].attr)
        dom.append(childEl, _.map(el.childNodes, (n) => n))
        desc.domParser = new DomParser(childEl, false)
      }
      markEl(el, !block)
      return desc.children
    }, (el, bindings) => {
      let expr = dom.text(el),
        parser = new TextParser(expr),
        token,
        i = 0

      let p = el.parentNode,
        l = p.childNodes.length,
        ii = index
      while (token = parser.nextToken()) {
        if (i < token.start)
          markEl(this.insertNotBlankText(expr.substring(i, token.start), el), false)
        bindings.push({
          type: TEXT,
          index: index,
          expression: token.token
        })
        markEl(this.insertText('binding', el), false)
        i = token.end
      }
      if (i) {
        markEl(this.insertNotBlankText(expr.substr(i), el), false)
        dom.remove(el)
      } else {
        markEl(el, false)
      }
    })

  },
  insertNotBlankText(content, before) {
    return (content) ? this.insertText(content || '&nbsp;', before) : undefined
  },
  insertText(content, before) {
    let el = document.createTextNode(content)
    dom.before(el, before)
    return el
  }
})
export default DomParser
