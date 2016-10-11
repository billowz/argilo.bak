import _ from 'ilos'
import proxy from './proxy'
import configuration from './configuration'
import logger from './log'
import {
  createWatcher
} from './watcher'

configuration.register({
  lazy: true,
  bindObservi: '__observi__',
  bindComplexObservi: '__complex_observi__'
})

export default _.dynamicClass({
  constructor(obj) {
    this.listens = {}
    this.changeRecords = {}
    this.notify = this.notify.bind(this)
    this.watchCnt = 0
    this.watcher = createWatcher(obj)
  },

  addListen(attr, handler) {
    let handlers = this.listens[attr],
      ret

    if (!handlers)
      this.listens[attr] = handlers = new LinkedList()

    if ((ret = handlers.push(handler) == 1) && handlers.size() == 1) {
      this.watch(attr)
      this.watchCnt++
    }
    return ret
  },

  removeListen(attr, handler) {
    let handlers = this.listens[attr],
      ret

    if (handlers && (ret = handlers.remove(handler) == 1) && handlers.empty()) {
      this.unwatch(attr)
      this.watchCnt--
    }
    return ret
  },

  hasListen(attr, handler) {
    switch (arguments.length) {
      case 0:
        return !!this.watchCnt
      case 1:
        return _.isFunc(attr) ? !_.each(this.listens, (handlers) => {
          return !handlers.contains(attr)
        }) : !!this.listens[attr]
      default:
        let handlers = this.listens[attr]
        return !!handlers && handlers.contains(handler)
    }
  }
})
