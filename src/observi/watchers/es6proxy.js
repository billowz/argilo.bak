import {
  registerWatcher
} from '../watcherFactory'
import ArrayWatcher from './ArrayWatcher'
import proxy from '../proxy'
import configuration from '../configuration'
import {
  dynamicClass
} from 'ilos'

const hasOwn = Object.prototype.hasOwnProperty

configuration.register('enableES6Proxy', true, 'init')
configuration.register('bindES6ProxySource', '__observi_es6proxy_source__', 'init')
configuration.register('bindES6Proxy', '__observi_es6proxy__', 'init')

registerWatcher('ES6Proxy', 10, function(config) {
  return window.Proxy && config.enableES6Proxy !== false
}, function(config) {
  let {
    bindES6ProxySource,
    bindES6Proxy
  } = config

  let cls = dynamicClass({
    extend: ArrayWatcher,
    constructor() {
      this.super(arguments)
      this.binded = false
    },
    watch(attr) {
      if (this.super([attr])) return
      if (!this.binded) {
        var obj = this.obj,
          _proxy = this.createProxy()
        this.proxy = _proxy
        obj[bindES6Proxy] = _proxy
        obj[bindES6ProxySource] = obj
        proxy.change(obj, _proxy)

        this.binded = true
      }
    },
    createProxy() {
      return new Proxy(this.obj, {
        set: (obj, attr, value) => {
          let oldVal = obj[attr]
          obj[attr] = value
          this.set(attr, value, oldVal)
          return true
        }
      })
    }
  })
  proxy.enable({
    obj(obj) {
      if (obj && hasOwn.call(obj, bindES6ProxySource))
        return obj[bindES6ProxySource]
      return obj
    },
    eq(o1, o2) {
      return o1 === o2 || proxy.obj(o1) === proxy.obj(o2)
    },
    proxy(obj) {
      if (obj && hasOwn.call(obj, bindES6Proxy))
        return obj[bindES6Proxy] || obj
      return obj
    }
  })
  return cls
})
