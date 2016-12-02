import Binding from './Binding'
import {
  expression
} from '../parser'
import {
  ContextKeyword,
  ElementKeyword,
  BindingKeyword,
  expressionParser
} from './expression'
import dom from '../../dom'
import configuration from '../configuration'
import {
  dynamicClass,
  each,
  isNil
} from 'ilos'

const expressionArgs = [ContextKeyword, ElementKeyword, BindingKeyword]

export default dynamicClass({
  extend: Binding,
  constructor(cfg) {
    this.super(arguments)
    this.expr = expression(cfg.expression, expressionArgs, expressionParser)
    if (Binding.comments) {
      this.comment = document.createComment('Text Binding ' + cfg.expression)
      dom.before(this.comment, this.el)
    }
    this.observeHandler = this.observeHandler.bind(this)
  },
  value() {
    let ctx = this.context()
    return this.expr.executeAll(ctx, [ctx, this.el, this])
  },
  bind() {
    each(this.expr.identities, (ident) => {
      this.observe(ident, this.observeHandler)
    })
    this.update(this.value())
  },
  unbind() {
    each(this.expr.identities, (ident) => {
      this.unobserve(ident, this.observeHandler)
    })
  },
  observeHandler(attr, val) {
    if (this.expr.isSimple()) {
      var ctx = this.context()
      this.update(this.expr.executeFilter(ctx, [ctx, this.el, this], val))
    } else {
      this.update(this.value())
    }
  },
  update(val) {
    if (isNil(val)) val = ''
    if (val !== dom.text(this.el))
      dom.text(this.el, val)
  }
})
