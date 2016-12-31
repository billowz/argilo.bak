import {
  configuration
} from './configuration'
import {
  LinkedList,
  policy as ilosPolicy,
  emptyFunc,
  assign,
  isFunc
} from 'ilos'

const hasOwn = Object.prototype.hasOwnProperty

let bindProxy = '__observi_proxy__'
configuration.register('key.proxy', bindProxy, 'init', val => (bindProxy = val))

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
    let key = bindProxy,
      handlers = hasOwn.call(obj, key) ? obj[key] : undefined
    if (handlers)
      handlers.each(handler => handler(obj, p))
  },
  on(obj, handler, checkFirst) {
    if (!isFunc(handler))
      throw TypeError(`Invalid Proxy Event Handler[${handler}`)

    let realObj = proxy.obj(obj),
      key = bindProxy,
      handlers = hasOwn.call(realObj, key) ? realObj[key] : (realObj[key] = new LinkedList())

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
    let key = bindProxy,
      handlers = hasOwn.call(obj, key) ? obj[key] : undefined

    if (handlers && isFunc(handler))
      return handlers.remove(handler) == 1
    return false
  },
  clean(obj) {
    let key = bindProxy
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
      ilosPolicy('hasOwn', function(obj, prop) {
        return hasOwn.call(proxy.obj(obj), prop)
      })
      ilosPolicy('eq', proxy.eq)
      enabled = true
    }
  },
  disable() {
    if (enabled === undefined) {
      enabled = false
      proxy.change = proxy.on = proxy.un = proxy.clean = emptyFunc
    }
  }
}
export function proxy(o) {
  return proxy.proxy(o)
}
assign(proxy, core)
