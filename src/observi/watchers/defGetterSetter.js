import ArrayWatcher from './ArrayWatcher'
import {
  registerWatcher
} from '../watcherFactory'
import proxy from '../proxy'
import {
  createClass
} from 'ilos'

registerWatcher('DefineGetterAndSetter', 30, function(config) {
  return '__defineGetter__' in {}
}, function(config) {
  let cls = createClass({
    extend: ArrayWatcher,
    watch(attr) {
      if (this.super([attr])) return

      let value = this.obj[attr]
      this.obj.__defineGetter__(attr, () => {
        return value
      })
      this.obj.__defineSetter__(attr, (val) => {
        let oldVal = value
        value = val
        this.set(attr, val, oldVal)
      })
    }
  })
  proxy.disable()
  return cls
})
