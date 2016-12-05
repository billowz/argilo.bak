import Collector from './Collector'
import {
  TemplateParser
} from './parser'
import configuration from './configuration'
import {
  createProxy
} from 'observi'
import {
  dynamicClass,
  isObject,
  isString,
  isFunc,
  isExtendOf
} from 'ilos'
import logger from './log'

let inited = false
const compontents = {}
export const Compontent = dynamicClass({
  constructor(cfg) {
    let Ct = cfg.collector,
      name = cfg.name

    if (!inited) {
      configuration.nextStatus()
      inited = true
    }
    this.templateParser = new TemplateParser(cfg.template, cfg.clone)
    if (!Ct) {
      Ct = Collector
    } else if (isObject(Ct)) {
      Ct.extend = Ct.extend || Collector
      Ct = dynamicClass(Ct)
    } else if (!isFunc(Ct)) {
      Ct = null
    }
    if (!Ct || (Ct !== Collector && !isExtendOf(Ct, Collector)))
      throw TypeError('Invalid Collector')
    this.Collector = Ct

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
    return createProxy(new this.Collector(this.Collector, this.templateParser, scope, props))
  }
})

export function getCompontent(name) {
  return compontents[name]
}
