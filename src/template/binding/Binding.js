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
    comments: false
  },
  constructor(cfg) {
    let ctx = this.ctx = obj(cfg.context)
    this.proxy = cfg.context
    this.el = cfg.el
    this.propScopes = ctx.$parent ? {} : undefined
  },
  findScope(expr, isProp) {
    return this.proxy.__findScope(expr, isProp)
  },
  observe(expr, callback) {
    this.proxy.observe(expr, callback)
  },
  unobserve(expr, callback) {
    this.proxy.unobserve(expr, callback)
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
