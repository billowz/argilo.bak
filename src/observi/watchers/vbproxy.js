import {
  ArrayWatcher
} from './ArrayWatcher'
import {
  registerWatcher
} from '../watcherFactory'
import {
  VBClassFactory
} from './VBClassFactory'
import {
  proxy
} from '../proxy'
import {
  configuration,
  keys
} from '../configuration'
import {
  createClass,
  LinkedList
} from 'ilos'

const props = 'defaultProps',
  proxyKey = 'key.VBProxy',
  constKey = 'key.VBConstructor'

configuration.register(props, [], 'init')
  .register(proxyKey, '__observi_vbproxy__', 'init')
  .register(constKey, '__observi_vb_constructor__', 'init')

registerWatcher('VBScriptProxy', 40, function(config) {
  return VBClassFactory.isSupport()
}, function(config) {
  let factory = new VBClassFactory(keys().concat(config[props]), config[constKey], config[proxyKey], proxy.change)

  let cls = createClass({
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
