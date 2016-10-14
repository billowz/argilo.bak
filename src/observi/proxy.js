import _ from 'ilos'
import configuration from './configuration'


configuration.register('bindProxy', '__observi_proxy__', 'init')

const hasOwn = Object.prototype.hasOwnProperty,
  cfg = configuration.get()

const defaultPolicy = {
    eq(o1, o2) {
      return o1 === o2
    },
    obj(o) {
      return o
    },
    proxy(o) {
      return o
    }
  },
  apply = {
    change(obj, p) {
      let key = cfg.bindProxy,
        handlers = hasOwn.call(obj, key) ? obj[key] : undefined
      if (handlers)
        handlers.each(handler => handler(obj, p))
    },
    on(obj, handler) {
      if (!_.isFunc(handler))
        throw TypeError(`Invalid Proxy Event Handler[${handler}`)

      obj = proxy.obj(obj)
      let key = cfg.bindProxy,
        handlers = hasOwn.call(obj, key) ? obj[key] : (obj[key] = new _.LinkedList())
      return handlers.push(handler) == 1
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
    }
  }
export default function proxy(o) {
  return proxy.proxy(o)
}
let hasEnabled = false
_.assign(proxy, {
  isEnable() {
    return proxy.on !== _.emptyFunc
  },
  enable(policy) {
    applyPolicy(policy)
    if (!hasEnabled) {
      _.policy('hasOwn', function(obj, prop) {
        return hasOwn.call(proxy.obj(obj), prop)
      })
      _.policy('eq', proxy.eq)
      hasEnabled = true
    }
  },
  disable() {
    applyPolicy(defaultPolicy)
  }
})

function applyPolicy(policy) {
  let _apply = policy !== defaultPolicy ? function(fn, name) {
    proxy[name] = fn
  } : function(fn, name) {
    proxy[name] = _.emptyFunc
  }
  _.each(apply, _apply)
  _.each(policy, (fn, name) => {
    proxy[name] = fn
  })
}
proxy.disable()
