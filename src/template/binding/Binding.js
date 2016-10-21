import configuration from '../configuration'
import {
  observe,
  unobserve,
  obj,
  proxy
} from 'observi'
import {
  dynamicClass,
  hasOwnProp,
  parseExpr,
  get,
  set,
  has
} from 'ilos'
const Binding = dynamicClass({
  statics: {
    commentCfg: 'generateComments'
  },
  constructor(cfg) {
    this._scope = obj(cfg.scope)
    this.el = cfg.el
    this.tpl = cfg.tpl
  },
  expressionScopeProvider(expr, realScope) {
    return realScope ? `$binding.exprScope('${expr}')` : '$scope'
  },
  scope() {
    let scope = this._scope
    return proxy(scope) || scope
  },
  realScope() {
    return this._scope
  },
  propScope(prop) {
    let scope = this.realScope(),
      parent

    while ((parent = scope.$parent) && !hasOwnProp(scope, prop)) {
      scope = parent
    }
    return proxy(scope) || scope
  },
  exprScope(expr) {
    return this.propScope(parseExpr(expr)[0])
  },
  observe(expr, callback) {
    observe(this.exprScope(expr), expr, callback)
  },
  unobserve(expr, callback) {
    unobserve(this.exprScope(expr), expr, callback)
  },
  get(expr) {
    return get(this.realScope(), expr)
  },
  has(expr) {
    return has(this.realScope(), expr)
  },
  set(expr, value) {
    set(this.scope(), expr, value)
  },
  bind() {
    throw new Error('abstract method')
  },
  unbind() {
    throw new Error('abstract method')
  },
  destroy() {}
})
configuration.register(Binding.commentCfg, true, 'init')
export default Binding
