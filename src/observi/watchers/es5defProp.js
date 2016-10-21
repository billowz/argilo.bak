import ArrayWatcher from './ArrayWatcher'
import {
  registerWatcher
} from '../watcherFactory'
import proxy from '../proxy'
import {
  dynamicClass
} from 'ilos'

registerWatcher('ES5DefineProperty', 20, function(config) {
  if (Object.defineProperty) {
    try {
      let val, obj = {}
      Object.defineProperty(obj, 'sentinel', {
        get() {
          return val
        },
        set(value) {
          val = value
        }
      })
      obj.sentinel = 1
      return obj.sentinel === val
    } catch (e) {}
  }
  return false
}, function(config) {
  let cls = dynamicClass({
    extend: ArrayWatcher,
    watch(attr) {
      if (this.super([attr])) return

      let value = this.obj[attr]
      Object.defineProperty(this.obj, attr, {
        enumerable: true,
        configurable: true,
        get: () => {
          return value
        },
        set: (val) => {
          let oldVal = value
          value = val
          this.set(attr, val, oldVal)
        }
      })
    }
  })
  proxy.disable()
  return cls
})
