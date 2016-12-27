import {
  Directive,
  ContextKeyword,
  ElementKeyword,
  EventKeyword,
  BindingKeyword,
  expressionParser
} from '../binding'
import {
  expression
} from '../parser'
import {
  hump
} from '../util'
import dom from '../../dom'
import logger from '../log'
import {
  createClass,
  assign,
  convert,
  isFunc,
  isObject
} from 'ilos'

const expressionArgs = [ContextKeyword, ElementKeyword, EventKeyword, BindingKeyword]

const EventDirective = createClass({
  extend: Directive,
  constructor() {
    this.super(arguments)
    this.handler = this.handler.bind(this)
    this.expression = expression(this.expr, expressionArgs, expressionParser)
  },
  handler(e) {
    e.stopPropagation()

    let exp = this.expression,
      proxy = this.proxy,
      args = [proxy, this.el, e, this]

    if (exp.filter(proxy, args, e) !== false) {
      let fn = exp.execute(proxy, args)
      if (exp.isSimple()) {
        if (isFunc(fn)) {
          proxy = this.findScope(exp.expr)
          fn.apply(proxy, proxy, this.el, e, this)
        } else {
          logger.warn('Invalid Event Handler:%s', this.expr, fn)
        }
      }
    }
  },
  updateEl(el) {
    dom.off(this.el, this.eventType, this.handler)
    dom.on(el, this.eventType, this.handler)
    this.el = el
  },
  bind() {
    dom.on(this.el, this.eventType, this.handler)
    this.binded = true
  },
  unbind() {
    this.binded = false
    dom.off(this.el, this.eventType, this.handler)
  }
})

const events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load',
  'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
    name: 'oninput',
    eventType: 'input propertychange'
  }
]

export default assign(convert(events, (opt) => {
  let name = isObject(opt) ? opt.name : opt
  return hump(name + 'Directive')
}, (opt) => {
  if (!isObject(opt))
    opt = {
      eventType: opt
    }
  let name = opt.name || `on${opt.eventType}`
  opt.extend = EventDirective
  return Directive.register(name, opt)
}), {
  EventDirective
})
