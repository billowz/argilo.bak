import ArrayWatcher from './ArrayWatcher'
import {
  registerWatcher
} from '../watcherFactory'
import _ from 'ilos'

registerWatcher('DefineGetterAndSetter', 30, function(config) {
  return '__defineGetter__' in {}
}, function(config) {
  return _.dynamicClass({
    extend: ArrayWatcher,
    watch(attr) {
      if (this.super([attr])) return

      let value = this.obj[attr]
      this.obj.__defineGetter__(attr, () => {
        this.get(attr, value)
        return value
      })
      this.obj.__defineSetter__(attr, (val) => {
        let oldVal = value
        value = val
        this.set(attr, val, oldVal)
      })
    }
  })
})
