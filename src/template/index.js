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
import configuration from './configuration'
import {
  configuration as observiConfiguration
} from 'observi'
import {
  dynamicClass,
  hasOwnProp,
  ConfigurationChain,
  assignIf
} from 'ilos'

const config = new ConfigurationChain(configuration, observiConfiguration)

let inited = false
const Template = dynamicClass({
  constructor(cfg) {
    if (!inited) {
      configuration.nextStatus()
      inited = true
    }
    this.parser = new TemplateParser(cfg.template, cfg.clone)
    this.collector = cfg.collector
  },
  complie(cfg) {
    return this.parser.complie(assignIf({
      scope: cfg.scope,
      props: cfg.props
    }, cfg.collector, this.collector))
  }
})

export {
  Template,
  Directive,
  directives,
  DirectiveParser,
  TextParser,
  expression,
  config as configuration
}
