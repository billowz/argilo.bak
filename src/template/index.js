import {
  Directive
} from './binding'
import directives from './directives'
import {
  TemplateParser,
  DirectiveParser,
  TextParser,
  expression
} from './parser'
import Collector from './Collector'
import configuration from './configuration'
import {
  configuration as observiConfiguration
} from 'observi'
import {
  dynamicClass,
  hasOwnProp,
  ConfigurationChain,
  assignIf,
  isObject,
  isFunc,
  isExtendOf
} from 'ilos'

const config = new ConfigurationChain(configuration, observiConfiguration)

let inited = false
const Template = dynamicClass({
  constructor(cfg) {
    if (!inited) {
      configuration.nextStatus()
      inited = true
    }
    this.templateParser = new TemplateParser(cfg.template, cfg.clone)
    let Ct = cfg.collector
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
  },
  complie(scope = {}, props = {}) {
    return new this.Collector(this.Collector, this.templateParser, scope, props)
  }
})

export {
  Collector,
  Template,
  Directive,
  directives,
  DirectiveParser,
  TextParser,
  expression,
  config as configuration
}
