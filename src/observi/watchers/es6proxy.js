import {
  ArrayWatcher
} from './ArrayWatcher'
import {
  registerWatcher
} from '../watcherFactory'
import {
  proxy
} from '../proxy'
import {
  configuration
} from '../configuration'
import {
  createClass
} from 'ilos'

const hasOwn = Object.prototype.hasOwnProperty
const disable = 'disableES6Proxy',
  sourceKey = 'key.ES6ProxySource',
  proxyKey = 'key.ES6Proxy'

configuration.register(disable, false, 'init')
  .register(sourceKey, '__observi_es6proxy_source__', 'init')
  .register(proxyKey, '__observi_es6proxy__', 'init')

registerWatcher('ES6Proxy', 10, function(config) {
  return window.Proxy && !config[disable]
}, function(config) {
  let bindES6ProxySource = config[sourceKey],
    bindES6Proxy = config[proxyKey]

  let cls = createClass({
    extend: ArrayWatcher,
    constructor() {
      this.super(arguments)
      this.binded = false
    },
    watch(attr) {
      if (this.super([attr])) return
      this.init()
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
    },
    init() {
      if (!this.binded) {
        var obj = this.obj,
          _proxy = this.createProxy()
        this.proxy = _proxy
        obj[bindES6Proxy] = _proxy
        obj[bindES6ProxySource] = obj
        proxy.change(obj, _proxy)
        this.binded = true
      }
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
