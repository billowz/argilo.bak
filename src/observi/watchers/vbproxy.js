import ArrayWatcher from './ArrayWatcher'
import {
  registerWatcher
} from '../watcherFactory'
import proxy from '../proxy'
import VBClassFactory from './VBClassFactory'
import configuration from '../configuration'
import {
  dynamicClass,
  LinkedList
} from 'ilos'

configuration.register('bindVBProxy', '__observi_vbproxy__', 'init')
configuration.register('VBProxyConst', '__observi_vbproxy_const__', 'init')
configuration.register('defaultProps', [], 'init')

registerWatcher('VBScriptProxy', 40, function(config) {
  return VBClassFactory.isSupport()
}, function(config) {
  let factory = new VBClassFactory([
    config.bindWatcher, config.bindObservi, config.bindProxy, LinkedList.LIST_KEY
  ].concat(config.defaultProps || []), configuration.get('VBProxyConst'), configuration.get('bindVBProxy'), proxy.change)

  let cls = dynamicClass({
    extend: ArrayWatcher,
    watch(attr) {
      if (this.super([attr]) || this.isArray) return
      let obj = this.obj,
        desc = this.init()
      this.proxy = desc.defineProperty(attr, {
        set: (val) => {
          let oldVal = obj[attr]
          obj[attr] = val
          this.set(attr, val, oldVal)
        }
      })
    },
    init() {
      let obj = this.obj,
        desc = this.desc
      if (!desc) {
        desc = this.desc = (factory.descriptor(obj) || factory.create(obj))
        this.proxy = desc.proxy
      }
      return desc
    }
  })
  proxy.enable({
    obj(obj) {
      return obj && factory.obj(obj)
    },
    eq(o1, o2) {
      return o1 === o2 || proxy.obj(o1) === proxy.obj(o2)
    },
    proxy(obj) {
      return obj && (factory.proxy(obj) || obj)
    }
  })
  return cls
})
