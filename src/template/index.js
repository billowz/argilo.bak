import {
  Directive
} from './binding'
import directives from './directives'
import {
  DomParser,
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
  ConfigurationChain
} from 'ilos'

const config = new ConfigurationChain(configuration, observiConfiguration)

let inited = false
const Template = dynamicClass({
  constructor(template, clone) {
    if (!inited) {
      configuration.nextStatus()
      inited = true
    }
    this.parser = new DomParser(template, clone)
  },
  complie(scope) {
    return this.parser.complie(scope)
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
