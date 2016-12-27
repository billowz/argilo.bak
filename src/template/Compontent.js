import {
  Controller
} from './Controller'
import {
  TemplateParser
} from './parser'
import configuration from './configuration'
import {
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
export const Compontent = createClass({
  constructor(options) {
    if (!inited) {
      configuration.nextStatus()
      observiInit()
      inited = true
    }
    this.templateParser = new TemplateParser(options.template, options)
    let Ct = options.controller
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

    let name = options.name
    if (isString(name)) {
      if (compontents[name]) {
        logger.warn('Re-Define Compontent[%s]', name)
      } else {
        logger.info('Define Compontent[%s]', name)
      }
      compontents[name] = this
    }
  },
  compile(props) {
    return Controller.newInstance(this.Controller, this.templateParser, props)
  }
})

export function getCompontent(name) {
  return compontents[name]
}

export function getAllCompontents() {
  return values(compontents)
}
