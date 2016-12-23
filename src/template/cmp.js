import {
  Controller
} from './Controller'
import {
  TemplateParser
} from './parser'
import configuration from './configuration'
import {
  createProxy,
  init as observiInit
} from 'observi'
import {
  createClass,
  isObject,
  isString,
  isFunc,
  isExtendOf,
  values
} from 'ilos'
import logger from './log'

let inited = false,
  compontents = {}
export function compontent(name, option) {
  if (arguments.length == 1) {
    option = name
    name = undefined
  }
}

export const Compontent = createClass({
  constructor(cfg) {
    let Ct = cfg.controller,
      name = cfg.name
    if (!inited) {
      configuration.nextStatus()
      observiInit()
      inited = true
    }
    this.templateParser = new TemplateParser(cfg.template, cfg)
    if (!Ct) {
      Ct = Controller
    } else if (isObject(Ct)) {
      Ct.extend = Ct.extend || Controller
      Ct = createClass(Ct)
    } else if (!isFunc(Ct)) {
      Ct = null
    }
    if (!Ct || (Ct !== Controller && !isExtendOf(Ct, Controller)))
      throw TypeError('Invalid Controller')
    this.Controller = Ct

    if (name && isString(name)) {
      if (compontents[name]) {
        logger.warn('Re-Define Compontent[%s]', name)
      } else {
        logger.info('Define Compontent[%s]', name)
      }
      compontents[name] = this
    }
  },
  compile(scope = {}, props = {}) {
    return createProxy(new this.Controller(this.Controller, this.templateParser, scope, props))
  }
})

export function getCompontent(name) {
  return compontents[name]
}

export function getAllCompontents() {
  return values(compontents)
}
