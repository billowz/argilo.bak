import configuration from '../configuration'
import {
  observe,
  unobserve,
  obj,
  proxy
} from 'observi'
import {
  createClass,
  hasOwnProp,
  parseExpr,
  get,
  set,
  has
} from 'ilos'
const Binding = createClass({
  statics: {
    comments: true
  },
  constructor(cfg) {
    this.ctx = obj(cfg.context)
    this.el = cfg.el
    let r = this.ctx,
      p
    while (p = r.$parent) {
      r = p
    }
    this.root = r
  },
  rootContext() {
    let ctx = this.root
    return proxy(ctx) || ctx
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

    while ((parent = ctx.$parent) && !hasOwnProp(ctx, prop) && prop in parent) {
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
    return get(this.ctx, expr)
  },
  has(expr) {
    return has(this.ctx, expr)
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
