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
  createClass,
  each,
  isNil
} from 'ilos'

const expressionArgs = [ContextKeyword, ElementKeyword, BindingKeyword]

export default createClass({
  extend: Binding,
  constructor(cfg) {
    this.super(arguments)
    this.expression = expression(cfg.expression, expressionArgs, expressionParser)
    this.exprArgs = [this.proxy, this.el, this]
    if (Binding.comments) {
      this.comment = document.createComment('Text Binding ' + cfg.expression)
      dom.before(this.comment, this.el)
    }
    this.observeHandler = this.observeHandler.bind(this)
  },
  value() {
    return this.expression.executeAll(this.proxy, this.exprArgs)
  },
  bind() {
    each(this.expression.identities, (ident) => {
      this.observe(ident, this.observeHandler)
    })
    this.update(this.value())
  },
  unbind() {
    each(this.expression.identities, (ident) => {
      this.unobserve(ident, this.observeHandler)
    })
  },
  observeHandler(attr, val) {
    if (this.expression.isSimple()) {
      this.update(this.expression.filter(this.proxy, this.exprArgs, val))
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
