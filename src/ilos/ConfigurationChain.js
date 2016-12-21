import {
  isArray
} from './is'
import {
  each
} from './collection'
import {
  createClass
} from './class'
import AbstractConfiguration from './AbstractConfiguration'

function check(cfg) {
  if (!(cfg instanceof AbstractConfiguration))
    throw new Error('Invalid Configuration: ' + cfg)
  return cfg
}
export default createClass({
  extend: AbstractConfiguration,
  constructor() {
    let cfgs = []
    each(arguments, cfg => {
      if (isArray(cfg)) {
        each(cfg, c => {
          cfgs.push(check(c))
        })
      } else {
        cfgs.push(check(cfg))
      }
    })
    this.cfgs = cfgs
  },
  hasConfig(name) {
    return each(this.cfgs, cfg => {
      return !cfg.hasConfig(name)
    }) == false
  },
  config(name, val) {
    each(this.cfgs, cfg => {
      cfg.config(name, val)
    })
  },
  get(name) {
    if (arguments.length) {
      var val = undefined
      each(this.cfgs, cfg => {
        if (cfg.hasConfig(name)) {
          val = cfg.get(name)
          return false
        }
      })
      return val
    }
    var cfg = {}
    each(this.cfgs, c => {
      c.each((val, name) => {
        cfg[name] = val
      })
    })
    return cfg
  },
  each(cb) {
    each(this.cfgs, cfg => {
      cfg.each(cb)
    })
  }
})
