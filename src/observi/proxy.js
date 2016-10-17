import _ from 'ilos'
import configuration from './configuration'


configuration.register('bindProxy', '__observi_proxy__', 'init')

const hasOwn = Object.prototype.hasOwnProperty,
  cfg = configuration.get()

let enabled = undefined

const core = {
  eq(o1, o2) {
    return o1 === o2
  },
  obj(o) {
    return o
  },
  proxy(o) {
    return o
  },
  change(obj, p) {
    let key = cfg.bindProxy,
      handlers = hasOwn.call(obj, key) ? obj[key] : undefined
    if (handlers)
      handlers.each(handler => handler(obj, p))
  },
  on(obj, handler, checkFirst) {
    if (!_.isFunc(handler))
      throw TypeError(`Invalid Proxy Event Handler[${handler}`)

    let realObj = proxy.obj(obj),
      key = cfg.bindProxy,
      handlers = hasOwn.call(realObj, key) ? realObj[key] : (realObj[key] = new _.LinkedList())

    if (handlers.push(handler) == 1) {
      var p
      if (obj === realObj && (p = proxy.proxy(obj)) !== obj)
        handler(obj, p)
      return true
    }
    return false
  },
  un(obj, handler) {
    obj = proxy.obj(obj)
    let key = cfg.bindProxy,
      handlers = hasOwn.call(obj, key) ? obj[key] : undefined

    if (handlers && _.isFunc(handler))
      return handlers.remove(handler) == 1
    return false
  },
  clean(obj) {
    let key = cfg.bindProxy
    obj = proxy.obj(obj)
    if (hasOwn.call(obj, key))
      obj[key] = undefined
  },
  isEnable() {
    return enabled
  },
  enable(policy) {
    if (enabled === undefined) {
      proxy.eq = policy.eq
      proxy.obj = policy.obj
      proxy.proxy = policy.proxy
      _.policy('hasOwn', function(obj, prop) {
        return hasOwn.call(proxy.obj(obj), prop)
      })
      _.policy('eq', proxy.eq)
      enabled = true
    }
  },
  disable() {
    if (enabled === undefined) {
      enabled = false
      proxy.change = proxy.on = proxy.un = proxy.clean = _.emptyFunc
    }
  }
}
export default function proxy(o) {
  return proxy.proxy(o)
}
_.assign(proxy, core)
