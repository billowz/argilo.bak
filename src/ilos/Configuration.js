import {
  hasOwnProp
} from './common'
import {
  isFunc,
  isString
} from './is'
import {
  each,
  indexOf
} from './collection'
import {
  create
} from './object'
import {
  dynamicClass
} from './class'
import Logger from './Logger'

const logger = Logger.logger

export default dynamicClass({
  constructor(def, statusList, defaultStatus, checkStatus) {
    this.cfg = def || {}
    this.cfgStatus = {}
    this.listens = {}
    statusList = statusList || []
    this.statusList = statusList
    this.statusCnt = statusList.length
    let idx = indexOf(statusList, defaultStatus)
    if (idx == -1) idx = 0
    this.status = statusList[idx]
    this.statusIdx = idx
    if (isFunc(checkStatus))
      this.checkStatus = checkStatus
  },
  nextStatus() {
    if (this.statusIdx < this.statusCnt)
      this.status = this.statusList[this.statusIdx++]
  },
  register(name, defVal, status, validator) {
    this.cfg[name] = defVal
    this.cfgStatus[name] = {
      statusIdx: indexOf(this.statusList, status),
      validator: validator
    }
    return this
  },
  checkStatus(s, cs, i, ci) {
    return i >= ci
  },
  config(name, val) {
    if (!arguments.length) {
      return create(this.cfg)
    } else if (arguments.length == 1) {
      if (isString(name)) {
        return this.cfg[name]
      } else if (isObject(name)) {
        each(name, (val, name) => {
          this.config(name, val)
        })
      }
    } else if (isString(name)) {
      if (hasOwnProp(this.cfg, name)) {
        var {
          statusIdx,
          validator
        } = this.cfgStatus[name]

        if (statusIdx != -1 && !this.checkStatus(status, currentStatus, statusIdx, currentStatusIdx)) {
          logger.warn('configuration[{}]: must use in status[{}]', name, status)
          return
        }
        if (isFunc(validator) && validator(name, val, this) !== true) {
          logger.warn('configuration[{}]: invalid value[{}]', name, val)
          return
        }
        var oldVal = this.cfg[name]
        this.cfg[name] = val
        each(this.listens[name], cb => {
          cb(name, val, oldVal, this)
        })
      }
    }
  },
  get(name) {
    return arguments.length ? this.cfg[name] : create(this.cfg)
  },
  on(name, handler) {
    if (!isFunc(handler))
      throw new Error('Invalid Callback')
    if (isArray(name)) {
      each(name, (name) => {
        this.on(name, handler)
      })
      return this
    } else {
      (this.listens[name] || (this.listens[name] = [])).push(handler)
    }
    return this
  },
  un(name, handler) {
    if (isArray(name)) {
      each(name, (name) => {
        this.un(name, handler)
      })
    } else {
      var queue = this.listens[name],
        idx = queue ? indexOf(queue, handler) : -1
      if (idx != -1)
        queue.splice(idx, 1)
    }
    return this
  }
})
