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
    comments: true
  },
  constructor(cfg) {
    this.ctx = obj(cfg.context)
    this.el = cfg.el
  },
  context() {
    let ctx = this.ctx
    return proxy(ctx) || ctx
  },
  realContext() {
    return this.ctx
  },
  propContext(prop) {
    let ctx = this.ctx,
      parent

    while ((parent = ctx.$parent) && !hasOwnProp(ctx, prop)) {
      ctx = parent
    }
    return proxy(ctx) || ctx
  },
  exprContext(expr) {
    return this.propContext(parseExpr(expr)[0])
  },
  observe(expr, callback) {
    observe(this.exprContext(expr), expr, callback)
  },
  unobserve(expr, callback) {
    unobserve(this.exprContext(expr), expr, callback)
  },
  get(expr) {
    return get(this.realContext(), expr)
  },
  has(expr) {
    return has(this.realContext(), expr)
  },
  set(expr, value) {
    set(this.context(), expr, value)
  },
  bind() {
    throw new Error('abstract method')
  },
  unbind() {
    throw new Error('abstract method')
  },
  destroy() {}
})
configuration.register('comments', Binding.comments, 'init', (val) => {
  Binding.comments = val
})
export default Binding