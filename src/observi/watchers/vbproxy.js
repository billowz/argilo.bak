import ArrayWatcher from './ArrayWatcher'
import {
  registerWatcher
} from '../watcherFactory'
import proxy from '../proxy'
import VBClassFactory from './VBClassFactory'
import _ from 'ilos'

registerWatcher('VBScriptProxy', 40, function(config) {
  return VBClassFactory.isSupport()
}, function(config) {
  let factory
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
  factory = new VBClassFactory([
    config.bindWatcher, config.bindObservi, config.bindProxy, _.LinkedList.LIST_KEY
  ].concat(config.defaultProps || []), proxy.change)

  return _.dynamicClass({
    extend: ArrayWatcher,
    watch(attr) {
      if (this.super([attr])) return
      let obj = this.obj,
        desc = this.desc || (this.desc = (factory.descriptor(obj) || factory.create(obj)))
      this.proxy = desc.defineProperty(attr, {
        set: (val) => {
          let oldVal = obj[attr]
          obj[attr] = val
          this.set(attr, val, oldVal)
        }
      })
    }
  })
})
