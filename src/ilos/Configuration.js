import {
  hasOwnProp
} from './common'
import {
  isFunc,
  isString,
  isObject
} from './is'
import {
  each,
  indexOf
} from './collection'
import {
  create
} from './object'
import {
  createClass
} from './class'
import {
  IConfiguration
} from './IConfiguration'
import {
  logger
} from './Logger'


export const Configuration = createClass({
  extend: IConfiguration,
  constructor(statusList, onStatusChange) {
    this.cfg = {}
    this.cfgStatus = {}
    this.listens = {}
    this.statusList = statusList || []
    this.statusIdx = this.statusList.length ? 0 : -1
    this.onStatusChange = onStatusChange
  },
  nextStatus() {
    let idx = this.statusIdx
    if (idx != -1 && idx < this.statusList.length) {
      this.statusIdx++;
      if (isFunc(this.onStatusChange))
        this.onStatusChange(this.statusList[this.statusIdx], this)
    }
  },
  register(name, value, status, setter, scope) {
    if (arguments.length == 1) {
      each(name, (opt, name) => {
        register(name, opt.value, opt.status, opt.setter)
      })
    } else {
      this.cfg[name] = value
      this.cfgStatus[name] = {
        statusIdx: indexOf(this.statusList, status),
        setter: setter,
        scope: scope
      }
    }
    return this
  },
  hasConfig(name) {
    return hasOwnProp(this.cfg, name)
  },
  config(name, val) {
    if (isObject(name)) {
      each(name, (val, name) => {
        this.config(name, val)
      })
    } else if (hasOwnProp(this.cfg, name)) {
      var {
        statusIdx,
        setter,
        scope
      } = this.cfgStatus[name]

      if (statusIdx < this.statusIdx) {
        logger.warn('configuration[%s]: must use before status[%s]', name, this.statusList[statusIdx])
        return
      }
      if (isFunc(setter))
        val = setter.call(scope, val, name, this)
      var oldVal = this.cfg[name]
      this.cfg[name] = val
      each(this.listens[name], cb => {
        cb(name, val, oldVal, this)
      })
    }
  },
  get(name) {
    return arguments.length ? this.cfg[name] : create(this.cfg)
  },
  each(cb) {
    each(this.cfg, (val, name) => {
      cb(val, name)
    })
  },
  on(name, handler) {
    if (!isFunc(handler))
      throw new Error('Invalid Callback')
    if (isArray(name)) {
      each(name, (name) => {
        this.on(name, handler)
      })
      return this
    } else if (this.hasConfig(name)) {
      (this.listens[name] || (this.listens[name] = [])).push(handler)
    }
    return this
  },
  un(name, handler) {
    if (isArray(name)) {
      each(name, (name) => {
        this.un(name, handler)
      })
    } else if (this.hasConfig(name)) {
      var queue = this.listens[name],
        idx = queue ? indexOf(queue, handler) : -1
      if (idx != -1)
        queue.splice(idx, 1)
    }
    return this
  }
})
