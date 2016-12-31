import {
  Watcher
} from '../Watcher'
import {
  createClass,
  isArray,
  each
} from 'ilos'

const arrayProto = Array.prototype,
  arrayHooks = 'fill,pop,push,reverse,shift,sort,splice,unshift'.split(',')

export const ArrayWatcher = createClass({
  extend: Watcher,
  constructor() {
    this.super(arguments)
    this.isArray = isArray(this.obj)
    if (this.isArray) {
      this.hookArray()
    }
  },
  watch(attr) {
    return this.isArray && attr == 'length'
  },
  hookArray() {
    each(arrayHooks, this.hookArrayMethod, this)
  },
  hookArrayMethod(name) {
    let obj = this.obj,
      method = arrayProto[name],
      len = obj.length,
      self = this

    obj[name] = function() {
      let len = obj.length,
        ret = method.apply(obj, arguments)
      self.set('length', obj.length, len)
      return ret
    }
  }
})
