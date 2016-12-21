import proxy from './proxy'
import {
  createClass,
  LinkedList,
  isPrimitive
} from 'ilos'

let interceptGetter = false
export default createClass({
  static: {
    interceptGetter(cb) {
      interceptGetter = true
      cb()
      interceptGetter = false
    }
  },
  constructor(obj) {
    this.obj = obj
    this.proxy = obj // proxy object eg: ES6 Proxy, VBScript
    this.setters = {} // setter callback queue
    this.watched = {} // watched cache
  },
  set(attr, val, oldVal) {
    queue = this.setters[attr]
    if (queue) {
      var eq = proxy.eq(val, oldVal)
      if (!eq || !isPrimitive(val)) {
        queue.each(cb => cb(attr, val, oldVal, this, eq))
      }
    }
  },
  setter(attr, cb) {
    return this.accessor(this.setters, attr, cb)
  },
  unsetter(attr, cb) {
    return this.unaccessor(this.setters, attr, cb)
  },
  // 1. add callback to accessor callback queue
  // 2. watch property if not-watched
  accessor(accessors, attr, cb) {
    let queue = accessors[attr] || (accessors[attr] = new LinkedList()),
      success = queue.push(cb) == 1
    if (success && !this.watched[attr]) {
      this.watch(attr)
      this.watched[attr] = true
    }
    return success
  },
  // 1. remove callback in accessor callback queue
  // not unwatch property, can reuse in next watch
  unaccessor(accessors, attr, cb) {
    let queue = accessors[attr]
    return queue ? queue.remove(cb) == 1 : false
  },
  init() {

  },
  // watch property, intercept getter and setter
  watch() {
    throw new Error('abstract function watch')
  }
})
