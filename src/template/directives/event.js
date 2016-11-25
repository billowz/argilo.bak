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
  dynamicClass,
  assign,
  convert,
  isFunc,
  isObject
} from 'ilos'

const expressionArgs = [ContextKeyword, ElementKeyword, EventKeyword, BindingKeyword]

const EventDirective = dynamicClass({
  extend: Directive,
  constructor() {
    this.super(arguments)
    this.handler = this.handler.bind(this)
    this.expression = expression(this.expr, expressionArgs, expressionParser)
  },
  handler(e) {
    e.stopPropagation()

    let ctx = this.context(),
      exp = this.expression

    if (exp.executeFilter(ctx, [ctx, this.el, e, this], e) !== false) {
      let fn = exp.execute(ctx, [ctx, this.el, e, this])
      if (exp.isSimple()) {
        if (isFunc(fn)) {
          ctx = this.exprContext(exp.expr)
          fn.call(ctx, ctx, this.el, e, this.tpl, this)
        } else {
          logger.warn('Invalid Event Handler:%s', this.expr, fn)
        }
      }
    }
  },
  bind() {
    dom.on(this.el, this.eventType, this.handler)
  },
  unbind() {
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
