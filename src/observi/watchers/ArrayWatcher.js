import Watcher from '../Watcher'
import _ from 'ilos'

const arrayProto = Array.prototype,
  arrayHooks = 'fill,pop,push,reverse,shift,sort,splice,unshift'.split(',')

export default _.dynamicClass({
  extend: Watcher,
  constructor() {
    this.super(arguments)
    this.isArray = _.isArray(this.obj)
    if (this.isArray) {
      this.hookArray()
    }
  },
  watch(attr) {
    return this.isArray && attr == 'length'
  },
  hookArray() {
    _.each(arrayHooks, this.hookArrayMethod, this)
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
