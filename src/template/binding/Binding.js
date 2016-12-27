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
    this.proxy = cfg.context
    this.ctx = obj(cfg.context)
    this.el = cfg.el
  },
  findScope(expr, isProp) {
    let prop = isProp ? expr : parseExpr(expr)[0],
      ctx = this.proxy,
      parent

    while ((parent = ctx.$parent) && !hasOwnProp(ctx, prop) && prop in parent) {
      ctx = parent
    }
    return ctx
  },
  observe(expr, callback) {
    observe(this.findScope(expr), expr, callback)
  },
  unobserve(expr, callback) {
    unobserve(this.findScope(expr), expr, callback)
  },
  get(expr) {
    return get(this.ctx, expr)
  },
  has(expr) {
    return has(this.ctx, expr)
  },
  set(expr, value) {
    set(this.findScope(expr), expr, value)
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
