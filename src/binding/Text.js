import Binding from './Binding'
import expression from '../expression'
import _ from 'ilos'
import dom from '../dom'
import configuration from '../configuration'

const expressionArgs = ['$scope', '$el', '$tpl', '$binding']

export default _.dynamicClass({
  extend: Binding,
  constructor(cfg) {
    this.super(arguments)
    this.expression = expression(cfg.expression, expressionArgs, this.expressionScopeProvider)
    if (configuration.get(Binding.commentCfg)) {
      this.comment = document.createComment('Text Binding ' + cfg.expression)
      dom.before(this.comment, this.el)
    }
    this.observeHandler = this.observeHandler.bind(this)
  },
  value() {
    let scope = this.scope()
    return this.expression.executeAll(scope, [scope, this.el, this.tpl, this])
  },
  bind() {
    _.each(this.expression.identities, (ident) => {
      this.observe(ident, this.observeHandler)
    })
    this.update(this.value())
  },
  unbind() {
    _.each(this.expression.identities, (ident) => {
      this.unobserve(ident, this.observeHandler)
    })
  },
  observeHandler(attr, val) {
    if (this.expression.isSimple()) {
      var scope = this.scope()
      this.update(this.expression.executeFilter(scope, [scope, this.el, this.tpl, this], val))
    } else {
      this.update(this.value())
    }
  },
  update(val) {
    if (_.isNil(val)) val = ''
    if (val !== dom.text(this.el))
      dom.text(this.el, val)
  }
})
