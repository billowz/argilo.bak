import {
  hasOwnProp
} from './common'
import {
  each,
  lastIndexOf
} from './collection'
import {
  create
} from './object'
import {
  dynamicClass
} from './class'

export default dynamicClass({
  constructor(def) {
    this.cfg = def || {}
    this.listens = []
  },
  register(name, defVal) {
    if (arguments.length == 1) {
      each(name, (val, name) => {
        this.cfg[name] = val
      })
    } else {
      this.cfg[name] = defVal
    }
    return this
  },
  config(cfg) {
    if (cfg) each(this.cfg, (val, key) => {
      if (hasOwnProp(cfg, key)) {
        var oldVal = this.cfg[key],
          val = cfg[key]
        this.cfg[key] = val
        each(this.listens, h => h(key, val, oldVal, this))
      }
    })
    return this
  },
  get(name) {
    return arguments.length ? this.cfg[name] : create(this.cfg)
  },
  listen(handler) {
    this.listens.push(handler)
  },
  unlisten(handler) {
    let idx = lastIndexOf(this.listens, handler)
    if (idx != -1)
      this.listens.splice(idx, 1)
  }
})
