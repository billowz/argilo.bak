export default _.dynamicClass({
  constructor(obj) {
    this.obj = obj
    this.proxy = proxy
    this.listens = {}
  },
  update(attr, val, oldVal) {},
  watch(attr, cb) {
    if (!this.listeners[attr]) {
      this.listeners[attr] = cb
      this.watch(attr)
      return true
    }
    return false
  },
  unwatch(attr) {
    if (this.listeners[attr]) {
      this.listeners[attr] = undefined
      this.unwatch(attr)
      return true
    }
    return false
  }
})
