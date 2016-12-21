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
import AbstractConfiguration from './AbstractConfiguration'
import Logger from './Logger'

const logger = Logger.logger

export default createClass({
  extend: AbstractConfiguration,
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
        validator
      } = this.cfgStatus[name]

      if (statusIdx != -1 && !this.checkStatus(this.statusList[statusIdx], this.status, statusIdx, this.statusIdx)) {
        logger.warn('configuration[%s]: must use in status[%s]', name, this.statusList[statusIdx])
        return
      }
      if (isFunc(validator) && validator(val, name, this) !== false) {
        logger.warn('configuration[%s]: invalid value[%s]', name, val)
        return
      }
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
